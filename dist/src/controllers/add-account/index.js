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
exports.AddAccount = void 0;
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
const queries_1 = __importDefault(require("../../graphql/accounts/queries"));
const mutations_1 = __importDefault(require("../../graphql/accounts/mutations"));
const commons_1 = __importDefault(require("../../commons"));
function resolveAccount({ doctor_id, account_number }) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield commons_1.default.createAction({
            doctor_id: doctor_id,
            account_number: account_number
        }, queries_1.default.ACCOUNT_EXISTS, 'bank_account_details');
        const account = data.length ? data[0] : null;
        return { accountData: account, accountErrors: error };
    });
}
function createAccount(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield commons_1.default.createAction({
            doctor_id: input.doctor_id,
            bank_name: input.bank_name,
            account_type_id: input.account_type_id,
            account_holder: input.account_holder,
            account_number: input.account_number,
            IFSC_code: input.IFSC_code
        }, mutations_1.default.ADD_ACCOUNT_DETAILS, 'insert_bank_account_details');
        return { account: data, errors: error };
    });
}
exports.AddAccount = {
    handle(req, res) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { doctor_id, bank_name, account_type_id, account_holder, account_number, IFSC_code } = 
                // eslint-disable-next-line no-unsafe-optional-chaining
                ((_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.input) === null || _b === void 0 ? void 0 : _b.input) || ((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.input) || (req === null || req === void 0 ? void 0 : req.body);
                const { accountData, accountErrors } = yield resolveAccount({
                    doctor_id,
                    account_number
                });
                if (accountErrors) {
                    return res.status(400).json({ status: false, message: accountErrors });
                }
                if (accountData) {
                    return res.status(400).json({ status: false, message: `Account already exists` });
                }
                const { account, errors } = yield createAccount({
                    doctor_id,
                    bank_name,
                    account_type_id,
                    account_holder,
                    account_number,
                    IFSC_code
                });
                if (errors) {
                    return res.status(400).json({ status: false, message: errors });
                }
                return res.status(200).json({
                    status: true,
                    message: `${account.returning[0].account_number} account number is added`,
                    data: account.returning[0]
                });
            }
            catch (e) {
                return res.status(400).json({ status: false, message: 'Something went wrong.' });
            }
        });
    }
};
module.exports = exports.AddAccount.handle;
//# sourceMappingURL=index.js.map