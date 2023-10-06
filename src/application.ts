import express from "express";
import basicAuth from "express-basic-auth";
import getDisplayVersionsController from "./getDisplayVersionsController";
import postNonCheckoutEventController from "./postNonCheckoutEventController";
import postCheckoutEventController from "./postCheckoutEventController";
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json()); // This line allows express to parse JSON bodies

// TODO: (2) tighten up CORS
app.use(cors({ origin: "*" }));
app.use(
  basicAuth({
    users: { "bulls-ai-web-server": process.env.WEB_SERVER_PASSWORD },
    unauthorizedResponse: "Access denied",
  })
);

// TODO: (2) investigate why the post events don't work locally
// TODO: (2) Our metrics are a little weird. We only unset the sessionId when a user checks out. If a user leaves the site, then comes back later. They would still be the same sessionId. We should probably unset the sessionId after a certain amount of time.
app.use("/get-display-versions", getDisplayVersionsController);
app.use("/post-non-checkout-event", postNonCheckoutEventController);
app.use("/post-checkout-event", postCheckoutEventController);

const port = 8080;
app.listen(port, () => {
  console.log(`Application listening on port ${port}`);
});
