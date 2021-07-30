const Router = require("express").Router;
const tokenAction = require("./actions/token");
const attrAction = require("./actions/attr");

const tokenRouter = Router();
tokenRouter.param("id", tokenAction.load);
tokenRouter.route("/").post(tokenAction.create);
tokenRouter.route("/:id").get(tokenAction.read);

const attrRouter = Router();
attrRouter.route("/").post(attrAction.create);

const appRouter = Router();
appRouter.get("/status", (_, res) => res.send("OK"));
appRouter.use("/tokens", tokenRouter);
appRouter.use("/attrs", attrRouter);

module.exports = appRouter;
