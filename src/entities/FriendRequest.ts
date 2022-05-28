import { ObjectId } from "mongodb";

const { Schema, model } = require("mongoose");
const FriendRequest = new Schema(
       {


              owner: {
                     type: Schema.ObjectId,
                     ref: "User",
                     required: [true, "please provide a friend owner"],
              }, PendingFriend: {
                     type: Schema.ObjectId,
                     ref: "User",
                     required: [true, "please provide a friend"],
              },


       },
       { timestamps: true }
);

export default model("FriendRequest", FriendRequest);
