import express from "express";
import { check, validationResult } from "express-validator";
import { Event, NonCheckoutEvent } from "./event_types";
import { saveNonCheckoutEvent } from "./supabase.server";

const router = express.Router();

router.post(
  "/",
  [
    check("product_id").isString(),
    check("version_id").isNumeric(),
    check("sessionId").isString(),
    check("randomizer").isNumeric(),
    check("storeId").isString(),
    check("eventId").isString(),
    check("eventName").isString(),
    check("clientID").isString(),
    check("timestamp").isISO8601(),
    check("traffic_percentage").isNumeric(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const event: NonCheckoutEvent = req.body;

      // Now you can use the event
      console.log(event);

      saveNonCheckoutEvent(event);

      res.sendStatus(200); // Send OK status
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
);

export default router;
