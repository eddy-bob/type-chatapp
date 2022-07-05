import { ObjectId } from "mongodb";
// define enum
enum ChatEnum {
       DELIVERED = "DELIVERED",
       READ = "READ"

}
const { Schema, model } = require("mongoose");
const GroupMessage = new Schema(
       {
              group: {
                     type: Schema.ObjectId,
                     ref: "Group",
              },
              sender: {
                     type: Schema.ObjectId || String,
                     ref: "User",
                     default: "NotifBot"

              },
              senderName: {
                     type: String,
                     required: [true, "please include a  sender name"],
              },

              message: {
                     type: String,
                     trim: true,
                     required: [true, "please include a group message"],


              },
              status: { type: String, enum: ChatEnum, default: "DELIVERED" },
              hideFrom: { type: [Schema.ObjectId], ref: "User" },
              attatchment: {
                     type: [String],
                     default: []

              }

       },
       { timestamps: true }
);

export default model("GroupChats", GroupMessage);
