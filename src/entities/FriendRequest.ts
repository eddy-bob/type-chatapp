import { ObjectId } from "mongodb";

const { Schema, model } = require("mongoose");
const FriendRequest = new Schema(
       {


              reciever: {
                     type: Schema.ObjectId,
                     ref: "User",
                     required: [true, "please provide a friend request reciever"],
              },
              PendingFriend: {
                     type: Schema.ObjectId,
                     ref: "User",
                     required: [true, "please provide a friend request sender"],
              },


       },
       { timestamps: true }
);

export default model("FriendRequest", FriendRequest);
