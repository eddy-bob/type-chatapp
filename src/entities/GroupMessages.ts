import { ObjectId } from "mongodb";

const { Schema, model } = require("mongoose");
const GroupMessage = new Schema(
       {
              group: {
                     type: Schema.ObjectId,
                     ref: "Group",
                     required: [true, "please provide a group "],
              },
              sender: {
                     type: Schema.ObjectId,
                     ref: "User",
                     required: [true, "please provide a sender"],
              },


              message: {
                     type: String,
                     trim: true,
                     required: [true, "please include a group message"],


              },
              hideFrom: [{ type: Schema.ObjectId, ref: "User" }]

       },
       { timestamps: true }
);

export default model("GroupMessages", GroupMessage);
