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
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
const cloudinary_1 = __importDefault(require("cloudinary"));
const locals_1 = __importDefault(require("../src/providers/locals"));
cloudinary_1.default.v2.config({
    cloud_name: locals_1.default.config().cloudinaryCloudName,
    api_key: locals_1.default.config().cloudinaryApiKey,
    api_secret: locals_1.default.config().cloudinaryApiSecret
});
class Cloudinary {
    constructor() {
        this.cloudinaryUpload = (file) => __awaiter(this, void 0, void 0, function* () {
            return yield cloudinary_1.default.v2.uploader.upload(file, { eager: [{ fetch_format: 'auto', format: 'pdf' }] }, function (error, result) {
                if (error) {
                    console.log(error);
                }
                console.log(result);
                return result;
            });
        });
        this.cloudinaryDelete = (public_id) => __awaiter(this, void 0, void 0, function* () {
            return yield cloudinary_1.default.v2.uploader
                .destroy(public_id)
                .then(result => {
                console.log(result);
                return result;
            })
                .catch(error => {
                console.log(error);
            });
        });
        this.cloudinaryDeleteAll = (public_ids) => __awaiter(this, void 0, void 0, function* () {
            return yield cloudinary_1.default.v2.api
                .delete_resources(public_ids)
                .then(result => {
                console.log(result);
            })
                .catch(error => {
                console.log(error);
            });
        });
    }
}
exports.default = new Cloudinary();
//# sourceMappingURL=cloudinary.js.map