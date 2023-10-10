import express from "express";
import { mapProductsToDisplayVersion } from "./types";
import { getDisplayVersionsForProduct } from "./supabase.server";
import { check, validationResult } from "express-validator";
import he from "he";

const router = express.Router();

router.get(
  "/",
  [check("productID").isString().trim().escape()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const productId = he.decode(req.query.productID);

      const product = await getDisplayVersionsForProduct(productId);

      res.send(product);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
);

export default router;
