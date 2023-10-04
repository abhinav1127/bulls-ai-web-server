import express from "express";
import basicAuth from "express-basic-auth";
import getDisplayVersionsController from "./getDisplayVersionsController";
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json()); // This line allows express to parse JSON bodies

app.use(cors());

app.use(
  basicAuth({
    users: { "bulls-ai-web-server": process.env.WEB_SERVER_PASSWORD },
    unauthorizedResponse: "Access denied",
  })
);

app.use("/get-display-versions", getDisplayVersionsController);

const port = 8080;
app.listen(port, () => {
  console.log(`Application listening on port ${port}`);
});
