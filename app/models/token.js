const httpStatus = require("http-status");
const mongoose = require("mongoose");
const ApiError = require("./error");
const Attribute = require("./attr");

const schema = new mongoose.Schema(
  {
    tokenId: { type: Number },
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true },
    attrs: { type: Array },
  },
  { timestamps: true }
);

schema.static({
  get: async function (tokenId) {
    const token = await this.findOne({ tokenId }).exec();
    if (!token) {
      throw new ApiError({
        message: "Token ID does not exist",
        status: httpStatus.NOT_FOUND,
      });
    }

    const extracted = {};
    const fields = ["name", "description", "image"];
    extracted["attributes"] = [];

    fields.forEach((field) => {
      extracted[field] = token[field];
    });
    for (let i = 0; i < token.attrs.length; i++) {
      extracted["attributes"].push(await Attribute.get(token.attrs[i]));
    }

    return extracted;
  },
});

module.exports = mongoose.model("Token", schema);
