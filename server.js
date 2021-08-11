const mongo = require("./config/mongo");
const app = require("./config/express");
const cron = require("node-cron");
const distribute = require("./cron");

mongo.connect();

app.listen(process.env.PORT, () =>
  console.log("Server listening on port " + process.env.PORT)
);

cron.schedule("0 0 1,15 * *", distribute);
