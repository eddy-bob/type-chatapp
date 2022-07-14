

const { Schema, model } = require("mongoose");
const Group = new Schema(
       {
              admin: {
                     type: Schema.ObjectId,
                     ref: "User",

              },

              name: {
                     type: String,
                     trim: true,
                     unique: true,
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
                     name: { type: String, default: "noimage" },
                     MimeType: String,
                     size: String,
                     url: String
              },

              moderators: [{ type: Schema.ObjectId, ref: "User" }],
              members: [{ type: Schema.ObjectId, ref: "User" }]

       },
       { timestamps: true }
);

export default model("GroupSchema", Group);
