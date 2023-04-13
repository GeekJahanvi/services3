"use strict";
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
const queries_1 = __importDefault(require("../../graphql/auth/queries"));
const mutations_1 = __importDefault(require("../../graphql/auth/mutations"));
const commons_1 = __importDefault(require("../../commons"));
function resolveOTP(user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield commons_1.default.createAction({
            user_id: user_id
        }, queries_1.default.GET_OTP, "users");
        console.log(error);
        return { otpData: data, otpErrors: error };
    });
}
function verifyOtp(user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield commons_1.default.createAction({
            user_id: user_id
        }, mutations_1.default.UPDATE_VERIFIED, "update_users");
        return { verifyOtpData: data, verifyOtpErrors: error };
    });
}
const VerifyUser = {
    handle(req, res) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { otp, user_id } = ((_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.input) === null || _b === void 0 ? void 0 : _b.input) || ((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.input) || (req === null || req === void 0 ? void 0 : req.body);
                const { otpData, otpErrors } = yield resolveOTP(user_id);
                if (otpErrors) {
                    return res.status(200).json({ status: false, message: otpErrors });
                }
                if (otpData[0].otp === otp) {
                    const { verifyOtpData, verifyOtpErrors } = yield verifyOtp(user_id);
                    if (verifyOtpErrors) {
                        return res.status(200).json({ status: false, message: verifyOtpErrors });
                    }
                    const verifyData = verifyOtpData.returning[0];
                    return res.status(200).json({ status: true, message: `OTP verified`, data: verifyData });
                }
                else {
                    return res.status(200).json({ status: true, message: `OTP did not match` });
                }
            }
            catch (e) {
                return res.status(200).json({ status: false, message: "Something went wrong." });
            }
        });
    }
};
module.exports = VerifyUser.handle;
//# sourceMappingURL=index.js.map