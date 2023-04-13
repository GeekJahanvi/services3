"use strict";
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
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
class Locals {
    static config() {
        dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
        const hasuraGraphqlURL = process.env.HASURA_GRAPHQL_URL || '';
        const hasuraAdminSecret = process.env.HASURA_GRAPHQL_ADMIN_SECRET || '';
        const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY || '';
        const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET || '';
        const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME || '';
        const cloudinaryUploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || '';
        const TwilioApiKey = process.env.TWILIO_API_KEY || '';
        const TwilioApiSecret = process.env.TWILIO_API_SECRET || '';
        const TwilioAccountSid = process.env.TWILIO_ACCOUNT_SID || '';
        const TwilioAuthToken = process.env.TWILIO_AUTH_TOKEN || '';
        const userEmail = process.env.USER_EMAIL || '';
        const userEmailPass = process.env.USER_EMAIL_PASS || '';
        return {
            hasuraGraphqlURL,
            hasuraAdminSecret,
            cloudinaryApiKey,
            cloudinaryApiSecret,
            cloudinaryCloudName,
            cloudinaryUploadPreset,
            TwilioApiKey,
            TwilioApiSecret,
            TwilioAccountSid,
            TwilioAuthToken,
            userEmail,
            userEmailPass
        };
    }
    static init(_express) {
        _express.locals.app = this.config();
        return _express;
    }
}
exports.default = Locals;
//# sourceMappingURL=locals.js.map