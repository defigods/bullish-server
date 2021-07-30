const httpStatus = require("http-status");
const Token = require("../models/token");

const load = async (req, _, next, id) => {
  try {
    req.locals = { token: await Token.get(id) };
    next();
  } catch (error) {
    next(error);
  }
};

const create = (req, res, next) => {
  new Token(req.body)
    .save()
    .then((_) => {
      res
        .status(httpStatus.CREATED)
        .send({ message: "Token minted successfully" });
    })
    .catch((err) => next(err));
};

const read = (req, res) => {
  res.status(httpStatus.OK).send(req.locals.token);
};

module.exports = { load, create, read };
