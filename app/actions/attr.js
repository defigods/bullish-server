const httpStatus = require("http-status");
const Attribute = require("../models/attr");

const create = (req, res, next) => {
  new Attribute(req.body)
    .save()
    .then((_) => {
      res
        .status(httpStatus.CREATED)
        .send({ message: "Attribute registered successfully" });
    })
    .catch((err) => next(err));
};

module.exports = { create };
