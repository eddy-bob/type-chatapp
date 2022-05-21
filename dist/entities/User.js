"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const bcrypt = __importStar(require("bcryptjs"));
const endpoints_config_1 = __importDefault(require("../config/endpoints.config"));
let User = class User {
    beforeInsert() {
        return __awaiter(this, void 0, void 0, function* () {
            this.password = yield bcrypt.hash(this.password, endpoints_config_1.default.bycriptHashRound);
            console.log(this.password);
        });
    }
};
__decorate([
    typeorm_1.ObjectIdColumn({ generated: true })
], User.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ length: 200, type: "varchar" })
], User.prototype, "firstName", void 0);
__decorate([
    typeorm_1.Column({ length: 200, type: "varchar" })
], User.prototype, "lastName", void 0);
__decorate([
    typeorm_1.Column({ select: false })
], User.prototype, "password", void 0);
__decorate([
    typeorm_1.Column({ unique: true }),
    class_validator_1.IsEmail()
], User.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({ type: "boolean", default: false })
], User.prototype, "isLoggedIn", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar", enum: ["USER", "ADMIN", "MODERATOR"], default: "USER" })
], User.prototype, "role", void 0);
__decorate([
    typeorm_1.Column()
], User.prototype, "profilePicture", void 0);
__decorate([
    typeorm_1.Column()
], User.prototype, "address", void 0);
__decorate([
    typeorm_1.Column({ type: "int" })
], User.prototype, "zipcode", void 0);
__decorate([
    typeorm_1.Column()
], User.prototype, "mobile", void 0);
__decorate([
    typeorm_1.CreateDateColumn()
], User.prototype, "createdDate", void 0);
__decorate([
    typeorm_1.UpdateDateColumn()
], User.prototype, "updatedDate", void 0);
__decorate([
    typeorm_1.BeforeInsert()
], User.prototype, "beforeInsert", null);
User = __decorate([
    typeorm_1.Entity()
], User);
exports.User = User;
//# sourceMappingURL=User.js.map