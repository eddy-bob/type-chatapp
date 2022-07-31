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
                     type: String
              },
              photo: {

                     MimeType: String,
                     size: String,
                     url: String
              },
              blocked: { type: Boolean, default: false },
            


       },
       { timestamps: true }
);
FriendSchema.pre('save',
       async function (this: any, next: NextFunction) {
              let response = await genFullName(this.friend)
              this.friendName = response[0]
              this.photo = response[1]
              next()
       }
)


export default model("FriendSc", FriendSchema);
