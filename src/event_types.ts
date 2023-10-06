import { usedGeneratedVersion } from "./helpers";

type EventName =
  | "product_viewed"
  | "checkout_completed"
  | "product_added_to_cart";

export interface Event {
  sessionId: string;
  randomizer: string;
  storeId: string;
  eventId: string;
  eventName: EventName;
  clientID: string;
  timestamp: string;
}

export interface NonCheckoutEvent extends Event {
  product_id: string;
  version_id: number | null;
  traffic_percentage: number;
}

export interface CheckoutForProduct {
  product_id: string;
  version_id: number | null;
  traffic_percentage: number;
  quantity: number;
  price: number | undefined;
}

export interface CheckoutEvent extends Event {
  data: CheckoutForProduct[];
}

export interface DBSessionInput {
  session_id: string;
  client_id: string;
  store_external_id: string;
  external_timestamp: string;
  randomizer: number;
}

interface DBEventStatisticsInput {
  viewed: boolean;
  added_to_cart: boolean;
  checkout_quantity: number;
}

export interface DBEventInput extends DBEventStatisticsInput {
  session_id: string;
  product_external_id: string;
  version_id: number | null;
}

export function buildDBSessionInput(event: Event): DBSessionInput {
  return {
    store_external_id: "gid://shopify/Shop/" + event.storeId,
    session_id: event.sessionId,
    client_id: event.clientID,
    external_timestamp: event.timestamp,
    randomizer: parseFloat(event.randomizer),
  };
}

export function buildDBEventInputForNonCheckoutEvent(
  event: NonCheckoutEvent
): DBEventInput {
  parseFloat(event.randomizer);
  return {
    viewed: true,
    added_to_cart: event.eventName === "product_added_to_cart",
    checkout_quantity: 0,
    session_id: event.sessionId,
    product_external_id: event.product_id,
    version_id: usedGeneratedVersion(
      event.traffic_percentage,
      parseFloat(event.randomizer)
    )
      ? event.version_id
      : null,
  };
}

export function nonCheckoutEventInputToMergeObject(
  event: NonCheckoutEvent
): object {
  if (event.eventName === "product_added_to_cart") {
    return {
      added_to_cart: true,
    };
  } else if (event.eventName === "product_viewed") {
    return {
      viewed: true,
    };
  }
  return {};
}

export function buildDBEventInputForCheckoutEvent(
  event: CheckoutEvent
): DBEventInput[] {
  return event.data.map((checkoutData) => {
    return {
      viewed: true,
      added_to_cart: true,
      checkout_quantity: checkoutData.quantity,
      price: checkoutData.price,
      session_id: event.sessionId,
      product_external_id: checkoutData.product_id,
      version_id: usedGeneratedVersion(
        checkoutData.traffic_percentage,
        parseFloat(event.randomizer)
      )
        ? checkoutData.version_id
        : null,
    };
  });
}
