import express from "express";
import { mapProductsToDisplayVersion } from "./types";
import { getDisplayVersionsForStore } from "./supabase.server";
import { check, validationResult } from "express-validator";
import he from "he";

const router = express.Router();

router.get(
  "/",
  [check("storeID").isString().trim().escape()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const storeId = he.decode(req.query.storeID);

      const data = await getDisplayVersionsForStore(storeId);

      const mappedData = mapProductsToDisplayVersion(data);

      res.send(mappedData);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
);

export default router;
