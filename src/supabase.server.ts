import { Product } from "./types";
import {
  CheckoutEvent,
  Event,
  NonCheckoutEvent,
  buildDBEventInputForCheckoutEvent,
  buildDBEventInputForNonCheckoutEvent,
  buildDBSessionInput,
  nonCheckoutEventInputToMergeObject,
} from "./event_types";

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const SUPABASE_URL = "https://zaindoaqylhqhyumzhrz.supabase.co";
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY || "";

// TODO: Consider setting persistSession to true
// https://github.com/nuxt-modules/supabase/issues/188
// https://chat.openai.com/c/15c5f503-2fca-4550-820f-8b5994e0ab2b
export const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY, {
  auth: { persistSession: false },
});

export const getDisplayVersionsForStore = async (
  storeId: string
): Promise<Product[]> => {
  try {
    console.log("storeId", storeId);

    const { data, error } = await supabase
      .from("products")
      .select(
        // TODO: (2) reconsider passing version id directly to frontend
        `external_id, stores!inner(), versions!inner(id, description_html, traffic_percentage, images!inner(image_url))`
      )
      .eq("stores.external_id", "gid://shopify/Shop/" + storeId)
      .eq("versions.status", "active");

    if (error) throw error;

    console.log("data", JSON.stringify(data, null, 2));

    return data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const saveNonCheckoutEvent = async (
  event: NonCheckoutEvent
): Promise<void> => {
  try {
    const { error: sessionsError } = await supabase
      .from("customer_sessions")
      .upsert(buildDBSessionInput(event));

    if (sessionsError) throw sessionsError;

    const eventRow = buildDBEventInputForNonCheckoutEvent(event);
    // Check if the row exists
    const { data: existingRows, error: fetchError } = await supabase
      .from("product_events")
      .select("*")
      .eq("product_external_id", eventRow.product_external_id)
      .eq("session_id", eventRow.session_id);

    // If the row exists, update it. Otherwise, insert it.
    if (existingRows.length > 1) {
      throw new Error("More than one row found for product");
    }

    if (fetchError) throw fetchError;

    // If the row exists, update it. Otherwise, insert it.
    if (existingRows.length === 1) {
      const { error: updateError } = await supabase
        .from("product_events")
        .update(nonCheckoutEventInputToMergeObject(event))
        .eq("product_external_id", eventRow.product_external_id)
        .eq("session_id", eventRow.session_id);

      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase
        .from("product_events")
        .insert(eventRow);

      if (insertError) throw insertError;
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const saveCheckoutEvent = async (
  event: CheckoutEvent
): Promise<void> => {
  try {
    const { error: sessionsError } = await supabase
      .from("customer_sessions")
      .upsert(buildDBSessionInput(event));

    if (sessionsError) throw sessionsError;

    const eventRows = buildDBEventInputForCheckoutEvent(event);

    const { error: upsertError } = await supabase
      .from("product_events")
      .upsert(eventRows, {
        onConflict: ["product_external_id", "session_id"],
      });

    if (upsertError) throw upsertError;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
