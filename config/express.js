require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const route = require("../app/route");
const middleware = require("../app/middleware");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../dist")));

app.use("/api", route);

app.use(middleware.converter);
app.use(middleware.notFound);
app.use(middleware.handler);

module.exports = app;
