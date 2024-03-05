const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  is_member: { type: Boolean, default: false },
  is_admin: { type: Boolean, default: false },
});

UserSchema.virtual("fullName").get(function () {
  return `${this.first_name} ${this.last_name}`;
});

UserSchema.virtual("status").get(function () {
  if (this.is_admin) return "Admin";
  else if (this.is_member) return "Member";
  else return "outsider";
});

module.exports = mongoose.model("User", UserSchema);
