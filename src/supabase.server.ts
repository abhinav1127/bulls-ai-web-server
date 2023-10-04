import { Product } from "./types";

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const SUPABASE_URL = "https://zaindoaqylhqhyumzhrz.supabase.co";
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY || "";
console.log("SUPABASE_API_KEY", SUPABASE_API_KEY);

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
        `external_id, stores!inner(), versions!inner(description_html, traffic_percentage, images!inner(image_url))`
      )
      .eq("stores.external_id", "gid://shopify/Shop/81344397612")
      .eq("versions.status", "active");

    if (error) throw error;

    console.log("data", JSON.stringify(data, null, 2));

    return data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
