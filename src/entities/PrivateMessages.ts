
const { Schema, model } = require("mongoose");
const PrivateChat = new Schema(
       {

              sender: {
                     type: Schema.ObjectId,
                     ref: "User",
                     required: [true, "please provide a sender"],
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
              hideFrom: { type: Schema.ObjectId, ref: "User" }

       },
       { timestamps: true }
);

export default model("PrivateChat", PrivateChat);
