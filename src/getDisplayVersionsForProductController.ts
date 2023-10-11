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

      const versions = await getDisplayVersionsForProduct(productId);
      if (versions.length > 1) {
        throw new Error(
          `Product with external_id ${productId} has more than 1 active version.`
        );
      }

      res.send(versions);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
);

export default router;
