const express = require("express");
const app = express();
const cors = require("cors");
const { createHash } = require("crypto");
require("dotenv").config();

app.use(cors());
app.use(express.json());

function hashBody(body, secret) {
  return createHash("sha256")
    .update(body)
    .update(createHash("sha256").update(secret, "utf8").digest("hex"))
    .digest("hex");
}

app.post("/webhook", (req, res) => {
  const signature = req.headers["x-signature"];
  const secretKey = process.env.WEBHOOK_SECRET;
  if (signature !== hashBody(JSON.stringify(req.body), secretKey)) {
    res.status(401).send("Invalid signature");
    return;
  } else {
    console.log(req.body);
    res.send("OK");
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
