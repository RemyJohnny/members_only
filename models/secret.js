const mongoose = require("mongoose");

const SecretSchema = new mongoose.Schema({
  name: { type: String },
  code: { type: String },
});

module.exports = mongoose.model("secret", SecretSchema);
