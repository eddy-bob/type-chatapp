import { ObjectId } from "mongodb";

const { Schema, model } = require("mongoose");
const Friend = new Schema(
       {


              owner: {
                     type: Schema.ObjectId,
                     ref: "User",
                     required: [true, "please provide a friend owner"],
              }, friend: {
                     type: Schema.ObjectId,
                     ref: "User",
                     required: [true, "please provide a friend"],
              },


       },
       { timestamps: true }
);

export default model("Friend", Friend);
