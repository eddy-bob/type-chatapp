const { Schema, model } = require("mongoose");
import { NextFunction } from "express";
import * as  crypto from "crypto";
const groupInvite = new Schema(
       {
              group: {
                     type: Schema.ObjectId,
                     ref: "Groups",
                     required: [true, "please provide an group"],
              },
              invitee: {
                     type: Schema.ObjectId,
                     ref: "User",
                     required: [true, "please provide an  invitee"],
              },
              inviteToken: {
                     type: String
              },
              expires: { type: Date },
       },
       { timestamps: true }
);
groupInvite.methods.getToken = async function () {
       let hashInviteToken;
       var token = crypto.randomBytes(20).toString("hex");
       hashInviteToken = crypto.createHash("sha256").update(token).digest("hex");
       this.inviteToken = hashInviteToken;
       this.expires = new Date(Date.now() + 120 * 60 * 1000);
       return hashInviteToken;
};

export default model("groupInvite", groupInvite);
