import { ObjectId } from "mongodb";
const { Schema, model } = require("mongoose");
import genFullName from "../utils/genFullName";
import { NextFunction } from "express";
const RecentChat = new Schema(
       {
              owner: { type: ObjectId, ref: "userMod" },
              friend: {
                     type: Schema.ObjectId,
                     ref: "userMod",
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

       },
       { timestamps: true }
);

RecentChat.pre('save',
       async function (this: any, next: NextFunction) {
              let response = await genFullName(this.friend)
              this.friendName = response[0]
              this.photo = response[1]
              next()
       }
)
export default model("RecentChat", RecentChat);
