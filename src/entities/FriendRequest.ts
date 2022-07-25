import { ObjectId } from "mongodb";
import genFullName from "../utils/genFullName";
import { NextFunction } from "express";
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

              pendingFriendName: {
                     type: String,
                     required: [true, "please provide a friend name"],
              },
              pendingFriendPhoto: {

                     MimeType: String,
                     size: String,
                     url: String
              },
       },
       { timestamps: true }
);
FriendRequest.pre('save', {
       async function(next: NextFunction) {
              let response = await genFullName(this.friend)
              this.pendingFriendName = response[0]
              this.pendingFriendPhoto = response[1]
              return next()
       }
})

export default model("FriendRequest", FriendRequest);
