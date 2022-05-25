import { geocoder } from '../services/goecoder';
import * as bcrypt from 'bcrypt';
import generateJWT from "../api/generateJWT"
import { NextFunction } from "express"
import endPoint from "../config/endpoints.config"
import * as crypto from "crypto";

// import { Point } from "geoJson"


// define enum
enum UserEnum {
       USER = "USER",
       ADMIN = "ADMIN",
       MODERATOR = "MODERATOR"

}
import { Schema, model } from "mongoose"
const User = new Schema({



       firstName: {
              require: true,
              type: String
       },

       lastName: {
              require: true,
              type: String
       },



       password: {
              type: String,
              select: false,
              required: [true, "please include a password"],
       },
       resetPasswordToken: { type: String, select: false },
       resetPasswordExpire: { type: Date, select: false },


       email: {
              require: true,
              type: String,
              match: [
                     // eslint-disable-next-line no-useless-escape
                     /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                     "please add a valid email",
              ],
       },



       isLoggedIn: { type: Boolean, default: false },
       role: {
              require: true,
              type: String,
              enum: UserEnum,
              default: "USER"
       },


       profilePicture: { type: String, defualt: "noProfile.jpg" },

       mobile: { required: [true, "please include a phone"], type: Number },
       zipcode: { type: Number },

       location: {
              type: {
                     type: String,
                     enum: ['Point'],

              },
              coordinates: {
                     type: [Number],

              },
       },

       formattedAddress: String,


       street: String,
       city: String,
       streetNumber: Number,

       country: String,
       countryCode: String,
       state: String,
       access_token: String

},
       { timestamps: true }




);
User.pre('save', async function () {
       if (this.isModified("zipcode")) {
              const loc = await geocoder(this.zipcode)
              this.location = {
                     type: 'Point',
                     coordinates: [loc[0].longitude, loc[0].latitude]
              }


              console.log(loc[0])
              return loc
       }
       else { return }
})

User.methods.hashPassword = async function (next: NextFunction) {
       const saltRounds = endPoint.bycriptHashRound;
       const hashPassword = await bcrypt.hash(this.password, saltRounds);
       this.password = hashPassword;
       return this.password;
};
User.methods.comparePassword = async function (oldPassword: string) {
       return bcrypt.compare(oldPassword, this.password);
};
User.methods.genResetPasswordToken = async function () {
       let hashToken;
       var token = crypto.randomBytes(20).toString("hex");
       hashToken = crypto.createHash("sha256").update(token).digest("hex");

       return hashToken;
};

User.methods.getToken = async function () {
       var token = generateJWT({ id: this._id })
       return token;
};

export default model("userModel", User);