"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary = require("cloudinary").v2;
const endpoints_config_1 = __importDefault(require("../config/endpoints.config"));
const uploadPhoto = (photo) => __awaiter(void 0, void 0, void 0, function* () {
    cloudinary.config({
        cloud_name: endpoints_config_1.default.cloudName,
        api_key: endpoints_config_1.default.cloudApiKey,
        api_secret: endpoints_config_1.default.cloudApiSecret,
        secure: true,
    });
    try {
        const image = yield cloudinary.uploader.upload(photo);
        return image;
    }
    catch (err) {
        return err;
    }
});
exports.default = uploadPhoto;
//# sourceMappingURL=uploadPhoto.js.map