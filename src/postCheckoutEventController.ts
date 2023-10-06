import express from "express";
import { check, validationResult } from "express-validator";
import { CheckoutEvent, Event, NonCheckoutEvent } from "./event_types";
import { saveCheckoutEvent, saveNonCheckoutEvent } from "./supabase.server";

const router = express.Router();

router.post(
  "/",
  [
    check("data").isArray(),
    check("data.*.product_id").isString(),
    check("data.*.version_id").isNumeric(),
    check("data.*.traffic_percentage").isNumeric(),
    check("data.*.quantity").isNumeric(),
    check("data.*.price").isNumeric(),
    check("sessionId").isString(),
    check("randomizer").isNumeric(),
    check("storeId").isString(),
    check("eventId").isString(),
    check("eventName").isString(),
    check("clientID").isString(),
    check("timestamp").isISO8601(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const event: CheckoutEvent = req.body;

      // Now you can use the event
      console.log(event);

      saveCheckoutEvent(event);

      res.sendStatus(200); // Send OK status
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
);

export default router;
