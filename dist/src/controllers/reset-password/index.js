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
const mutations_1 = __importDefault(require("../../graphql/auth/mutations"));
const commons_1 = __importDefault(require("../../commons"));
function updatePassword(email, hash_password) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield commons_1.default.createAction({
            _eq: email,
            hash_password: hash_password
        }, mutations_1.default.RESET_PASSWORD, 'update_users');
        return { passwordData: data, passwordErrors: error };
    });
}
const ResetPassword = {
    handle(req, res) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = ((_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.input) === null || _b === void 0 ? void 0 : _b.input) || ((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.input) || (req === null || req === void 0 ? void 0 : req.body);
                const hash_password = yield commons_1.default.encryptPassword(password);
                const { passwordData, passwordErrors } = yield updatePassword(email, hash_password);
                if (passwordErrors) {
                    return res.status(200).json({ status: false, message: passwordErrors });
                }
                return res
                    .status(200)
                    .json({ status: true, message: `Password updated`, data: passwordData.returning[0] });
            }
            catch (e) {
                return res.status(200).json({ status: false, message: 'Something went wrong.' });
            }
        });
    }
};
module.exports = ResetPassword.handle;
//# sourceMappingURL=index.js.map