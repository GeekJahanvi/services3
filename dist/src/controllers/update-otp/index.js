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
const mutations_1 = __importDefault(require("../../graphql/auth/mutations"));
const commons_1 = __importDefault(require("../../commons"));
const locals_1 = __importDefault(require("../../providers/locals"));
const nodemailer_1 = __importDefault(require("nodemailer"));
function updateOtp(user_id, otp1) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield commons_1.default.createAction({
            user_id: user_id,
            otp: otp1
        }, mutations_1.default.UPDATE_OTP, "update_users");
        return { otpData: data, otpErrors: error };
    });
}
const UpdateOtp = {
    handle(req, res) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user_id, email } = ((_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.input) === null || _b === void 0 ? void 0 : _b.input) || ((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.input) || (req === null || req === void 0 ? void 0 : req.body);
                const otp1 = Math.floor(1000 + Math.random() * 9000);
                try {
                    const transporter = nodemailer_1.default.createTransport({
                        service: 'Gmail',
                        auth: {
                            user: locals_1.default.config().userEmail,
                            pass: locals_1.default.config().userEmailPass
                        }
                    });
                    const mailOptions = {
                        from: locals_1.default.config().userEmail,
                        to: email,
                        subject: 'Sending Email using Node.js',
                        html: `<h1>hello your otp for login is ${otp1}</h1>`,
                        text: 'Heelooo'
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        }
                        else {
                            console.log(JSON.stringify(info));
                        }
                    });
                }
                catch (error) {
                    return res.status(200).json({ status: false, message: 'otp not sent' });
                }
                const { otpData, otpErrors } = yield updateOtp(user_id, otp1);
                if (otpErrors) {
                    return res.status(200).json({ status: false, message: otpErrors });
                }
                return res.status(200).json({ status: true, message: `Otp updated`, data: otpData.returning[0] });
            }
            catch (e) {
                console.error(e);
                return res.status(200).json({ status: false, message: "Something went wrong." });
            }
        });
    }
};
module.exports = UpdateOtp.handle;
//# sourceMappingURL=index.js.map