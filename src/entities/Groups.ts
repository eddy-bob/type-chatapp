import { ObjectId } from "mongodb";

const { Schema, model } = require("mongoose");
const Group = new Schema(
       {
              admin: {
                     type: Schema.ObjectId,
                     ref: "User",
                     required: [true, "please provide a group creato"],
              },

              name: {
                     type: String,
                     trim: true,
                     required: [true, "please include a group name"]
              },

              description: {
                     type: String,
                     trim: true,
                     required: [true, "please include a group description"],
                     max: [40, "description can have more than 40 characters"],
                     min: [15, "description can have less than 15 characters"]

              },
              photo: {
                     name: String,
                     MimeType: String,
                     size: String
              },

              moderator: [{ type: Schema.ObjectId, ref: "User" }]

       },
       { timestamps: true }
);

export default model("Group", Group);
