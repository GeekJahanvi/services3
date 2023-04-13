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
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
const nodemailer_1 = __importDefault(require("nodemailer"));
const queries_1 = __importDefault(require("../../graphql/auth/queries"));
const mutations_1 = __importDefault(require("../../graphql/auth/mutations"));
const commons_1 = __importDefault(require("../../commons"));
const locals_1 = __importDefault(require("../../providers/locals"));
function resolveUser(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield commons_1.default.createAction({
            _eq: email
        }, queries_1.default.CHECK_IF_USER_EXISTS, 'users');
        const user = data.length ? data[0] : null;
        return { userData: user, userErrors: error };
    });
}
function createUser(email, fullname, hash_password, role_id, otp1) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield commons_1.default.createAction({
            email,
            first_name: fullname.split(' ')[0],
            last_name: fullname.split(' ')[1],
            hash_password,
            role_id,
            otp: otp1
        }, mutations_1.default.CREATE_USER, 'insert_users_one');
        return { createUserData: data, createUserErrors: error };
    });
}
const Signup = {
    handle(req, res) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, fullname, password, role_id } = ((_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.input) === null || _b === void 0 ? void 0 : _b.input) || ((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.input) || (req === null || req === void 0 ? void 0 : req.body);
                const { userData, userErrors } = yield resolveUser(email);
                if (userErrors) {
                    return res.status(200).json({ status: false, message: userErrors });
                }
                if (userData) {
                    return res
                        .status(200)
                        .json({ status: false, message: `User with this email already exists` });
                }
                const hash_password = yield commons_1.default.encryptPassword(password);
                const otp1 = Math.floor(1000 + Math.random() * 9000);
                try {
                    const otp1 = Math.floor(1000 + Math.random() * 9000);
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
                            return res.status(200).json({ status: false, message: 'error in transporter' });
                        }
                        else {
                            console.log(JSON.stringify(info));
                        }
                    });
                }
                catch (error) {
                    return res.status(200).json({ status: false, message: 'otp not sent' });
                }
                const { createUserData, createUserErrors } = yield createUser(email, fullname, hash_password, role_id, otp1);
                if (createUserErrors) {
                    return res.status(200).json({ status: false, message: createUserErrors });
                }
                return res.status(200).json({ status: true, message: `User Added`, data: createUserData });
            }
            catch (e) {
                return res.status(200).json({ status: false, message: 'Something went wrong.' });
            }
        });
    }
};
module.exports = Signup.handle;
//# sourceMappingURL=index.js.map