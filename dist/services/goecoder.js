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
Object.defineProperty(exports, "__esModule", { value: true });
exports.geocoder = void 0;
const geocoder = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const NodeGeocoder = require('node-geocoder');
    const options = {
        provider: 'google',
        apiKey: 'AIzaSyB2D1wwqCbO6dxeYKIBeEisPgiR0QEhpgc',
        formatter: null // 'gpx', 'string', ...
    };
    const geocoder = NodeGeocoder(options);
    const res = yield geocoder.geocode([payload[0], payload[1]]);
    return res;
});
exports.geocoder = geocoder;
//# sourceMappingURL=goecoder.js.map