

const { Schema, model, } = require("mongoose");

import { NextFunction } from "express";
import { ObjectId } from "mongodb";

import UserMod from "../entities/User"

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
              friendName: {
                     type: String,
                     required: [true, "please provide a friend name"],
              },
              blocked: { type: Boolean, default: false }


       },
       { timestamps: true }
);


Friend.static.genFullName = async function (id: ObjectId) {

       const friend = await UserMod.findById(id)
       const fullname = `${friend.firstname} '' ${friend.firstname}`

       return fullname
}

Friend.pre("save", async function (next: NextFunction) {

       Friend.friendName = await Friend.genFullName(Friend.friend)
       return next()
})


export default model("Friend", Friend);
