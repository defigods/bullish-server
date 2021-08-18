const httpStatus = require("http-status");
const mongoose = require("mongoose");
const ApiError = require("./error");
const Attribute = require("./attr");

const schema = new mongoose.Schema(
  {
    tokenId: { type: Number, unique: true },
    name: { type: String, required: true },
    description: { type: String },
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
    const fields = ["name", "description"];
    extracted["attributes"] = [];

    fields.forEach((field) => {
      extracted[field] = token[field];
    });
    extracted["image"] = `https://ipfs.io/ipfs/${
      tokenId == 0
        ? "QmYo9KtDD6SxXdALTNSpDmKHS9oLD6HDFrx3BrfdDCuaUJ"
        : "QmYLnF62xc48bD9rRnvd99XJ6bJ622FGWwxjrtRiJvPrpD"
    }/${token["tokenId"]}.png`;

    for (let i = 0; i < token.attrs.length; i++) {
      extracted["attributes"].push(await Attribute.get(token.attrs[i]));
    }

    return extracted;
  },

  getSaved: async function () {
    return (
      await this.find({}, { tokenId: 1, _id: 0 }, { sort: { tokenId: 1 } })
    ).map((x) => x.tokenId);
  },
});

module.exports = mongoose.model("Token", schema);
