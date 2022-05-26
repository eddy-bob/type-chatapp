const { Schema, model } = require("mongoose");
import * as  crypto from "crypto";
const verifyEmail = new Schema(
  {
    user: {
      type: Schema.ObjectId,
      ref: "User",
      required: [true, "please provide an object id"],
    },
    verificationToken: { type: String },
    expires: { type: Date },
  },
  { timestamps: true }
);
verifyEmail.methods.getToken = async function () {
  let hashEmailToken;
  var token = crypto.randomBytes(20).toString("hex");
  hashEmailToken = crypto.createHash("sha256").update(token).digest("hex");
  this.verificationToken = hashEmailToken;
  this.expires = new Date(Date.now() + 10 * 60 * 1000);
  return hashEmailToken;
};
export default model("verifyEmailSchema", verifyEmail);
