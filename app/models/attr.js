const httpStatus = require("http-status");
const mongoose = require("mongoose");
const ApiError = require("./error");

const TYPES = [
  "Background",
  "Clothes",
  "Skin Color",
  "Headgear",
  "Eyes",
  "Earring",
  "Mouth",
];

const schema = new mongoose.Schema(
  {
    id: { type: Number, unique: true },
    type: { type: Number, required: true },
    value: { type: String, required: true },
  },
  { timestamps: true }
);

schema.static({
  get: async function (id) {
    const attr = await this.findOne({ id }).exec();
    if (!attr) {
      throw new ApiError({
        message: "Attribute does not exist",
        status: httpStatus.NOT_FOUND,
      });
    }

    return { trait_type: TYPES[attr.type - 1], value: attr.value };
  },
});

module.exports = mongoose.model("Attribute", schema);
