const { Schema, model } = require("mongoose");
// define enum
enum CallEnum {
  INITIALIZED = "INITIALIZED",
  REJECTED = "REJECTED",
  ENDED = "ENDED",
  ACCEPTED = "ACCEPTED",
  MISSED = "MISSED",
}
const PrivateVideoCall = new Schema(
  {
    caller: {
      type: Schema.ObjectId,
      ref: "User",
      required: [true, "please provide a caller"],
    },
    callerName: {
      type: String,
      required: [true, "please include a  sender name"],
    },
    reciever: {
      type: Schema.ObjectId,
      ref: "User",
      required: [true, "please provide a reciever"],
    },

    hideFrom: { type: Schema.ObjectId, ref: "User" },
    status: { type: String, enum: CallEnum, default: CallEnum.INITIALIZED },
  },
  { timestamps: true }
);

export default model("PrivateVideoCall", PrivateVideoCall);
