const { Schema, model } = require("mongoose");
import genFullName from "../utils/genFullName";
import { NextFunction } from "express";




const FriendSchema = new Schema(
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
              friendName: {
                     type: String,
                     required: [true, "please provide a friend name"],
              },
              photo: {
                     name: { type: String, default: "noimage.jpg" },
                     MimeType: String,
                     size: String
              },
              blocked: { type: Boolean, default: false }


       },
       { timestamps: true }
);
FriendSchema.pre('save', {
       async function(next: NextFunction) {
              let response = await genFullName(this.friend)
              this.friendName = response[0]
              this.photo.name = response[1]
              return next()
       }
})


export default model("Friend", FriendSchema);
