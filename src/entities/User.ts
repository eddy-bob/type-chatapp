import { geocoder } from '../services/goecoder';
import * as bcrypt from 'bcrypt';
import generateJWT from "../api/generateJWT"
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
              type: String,
              trim: true,
              required: [true, "please include a first name"]
       },

       lastName: {
              type: String,
              trim: true,
              required: [true, "please include a last name"]

       },

       about: {
              type: String,
              trim: true,
              min: [10, "About you must not be less 10 letters"],

              max: [32, "About you must not be less 32 letters"]

       },

       password: {
              type: String,
              select: false,
              required: [true, "please include a password"],
              min: [6, "password can not be less than 6 characters"]
       },
       resetPasswordToken: { type: String, select: false },
       resetPasswordExpire: { type: Date, select: false },


       email: {
              required: [true, "please include an email"],
              type: String,
              index: { unique: true, dropDups: true },
              match: [
                     // eslint-disable-next-line no-useless-escape
                     /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                     "please add a valid email",
              ],
       },



       isLoggedIn: { type: Boolean, default: false },
       role: {
              required: true,
              type: String,
              enum: UserEnum,
              default: "USER"
       },


       photo: {

              mimeType: String,
              size: String,
              url: String
       },

       coverPhoto: {

              mimeType: String,
              size: String,
              url: String
       },
       mobile: {
              type: String,
              required: [true, "please include a mobile number"],
              index: { unique: true, dropDups: true }
       },
       region: {
              type: String,

       },
       zipcode: Number,

       location: {
              select: false,
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
       socket: String

},
       { timestamps: true }




);
User.pre('save', async function (next) {

       if (!this.isModified("zipcode") && !this.isModified("country")) { return next() } else {
              const loc = await geocoder([this.zipcode, this.country])
              if (loc[0]) {

                     this.location = {
                            type: 'Point',
                            coordinates: [loc[0].longitude, loc[0].latitude]
                     }

                     this.formattedAddress = loc[0]?.formattedAddress,
                            this.countryCode = loc[0]?.countryCode,

                            this.state = loc[0]?.administrativeLevels.level1lon

              }



       }



})


User.methods.hashPassword = async function () {
       const saltRounds = endPoint.bycriptHashRound;
       const hashPassword = bcrypt.hashSync(this.password, 10);
       this.password = hashPassword;
       return this.password;
};
User.methods.comparePassword = async function (oldPassword: string) {
       return bcrypt.compareSync(oldPassword, this.password);
};
User.methods.genResetPasswordToken = async function () {
       let hashToken;
       var token = crypto.randomBytes(20).toString("hex");
       hashToken = crypto.createHash("sha256").update(token).digest("hex");
       // set expire=y date
       this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
       this.resetPasswordToken = hashToken
       return hashToken;

};

User.methods.getToken = async function () {
       var token = generateJWT({ id: this._id })
       return token;
};

export default model("userMod", User);