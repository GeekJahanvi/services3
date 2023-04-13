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
const commons_1 = __importDefault(require("../../commons"));
const queries_1 = __importDefault(require("../../graphql/auth/queries"));
const mutations_1 = __importDefault(require("../../graphql/auth/mutations"));
function resolveChangePassword(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield commons_1.default.createAction({
            email: email
        }, queries_1.default.FORGOT_PASSWORD, 'users');
        const password = data.length ? data[0] : null;
        return { passwordData: password, passwordErrors: error };
    });
}
function ProfileDetails(user_id, hash_password) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield commons_1.default.createAction({
            user_id: user_id,
            hash_password: hash_password,
        }, mutations_1.default.UPDATE_CHANGE_PASSWORD, 'update_users');
        return { password: data, errors: error };
    });
}
const UpdateChangePassword = {
    handle(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { input } = req.body || {};
                const { user_id, current_password, email, new_password } = (_b = (_a = input === null || input === void 0 ? void 0 : input.input) !== null && _a !== void 0 ? _a : input) !== null && _b !== void 0 ? _b : {};
                const hash_password = yield commons_1.default.encryptPassword(new_password);
                const { passwordData, passwordErrors } = yield resolveChangePassword(email);
                if (passwordErrors) {
                    return res.status(200).json({ status: false, message: passwordErrors });
                }
                if (yield commons_1.default.verifyPassword(passwordData.hash_password, current_password)) {
                    const { password, errors } = yield ProfileDetails(user_id, hash_password);
                    if (errors) {
                        return res.status(200).json({ status: false, message: errors });
                    }
                    const changePassword = password.returning[0];
                    if (!changePassword) {
                        return res.status(400).json({
                            status: false,
                            message: 'Password not changed'
                        });
                    }
                    else {
                        return res.status(200).json({
                            status: true,
                            message: 'password changed',
                            returning: password.returning[0]
                        });
                    }
                }
                else {
                    return res.status(400).json({
                        status: false,
                        message: 'current password is wrong'
                    });
                }
            }
            catch (e) {
                return res.status(200).json({ status: false, message: 'Something went wrong.' });
            }
        });
    }
};
module.exports = UpdateChangePassword.handle;
//# sourceMappingURL=index.js.map