
const { Schema, model } = require("mongoose");
// define enum
enum ChatEnum {
       DELIVERED = "DELIVERED",
       READ = "READ"

}
const PrivateChat = new Schema(
       {

              sender: {
                     type: Schema.ObjectId,
                     ref: "User",
                     required: [true, "please provide a sender"],
              },
              senderName: {
                     type: String,
                     required: [true, "please include a  sender name"],
              },
              reciever: {
                     type: Schema.ObjectId,
                     ref: "User",
                     required: [true, "please provide a reciever"],
              },
              message: {
                     type: String,
                     trim: true,
                     required: [true, "please include a  message"],


              },
              attatchment: {
                     type: [String]
                     , default: []
              },
              forwarded: { type: Boolean, default: false },
              hideFrom: { type: Schema.ObjectId, ref: "User" },
              status: { type: String, enum: ChatEnum, default: "DELIVERED" },


       },
       { timestamps: true }
);

export default model("PrivateChat", PrivateChat);
