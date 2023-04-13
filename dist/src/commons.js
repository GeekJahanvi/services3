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
const locals_1 = __importDefault(require("./providers/locals"));
const argon2_1 = __importDefault(require("argon2"));
class Commons {
    constructor() {
        this.axios = require('axios');
        this.createAction = (input, mutationGql, mutationName) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, errors } = yield this.GQLRequest({
                    variables: Object.assign({}, input),
                    query: mutationGql
                });
                let error;
                if (!data || !(data === null || data === void 0 ? void 0 : data.data) || !(data === null || data === void 0 ? void 0 : data.data[mutationName])) {
                    error =
                        errors || data.errors[0].message || `Something went wrong in mutation ${mutationName}`;
                }
                const dataError = errors ? errors : error;
                const axiosData = dataError ? null : data === null || data === void 0 ? void 0 : data.data[mutationName];
                return {
                    data: axiosData,
                    error: dataError || null
                };
            }
            catch (err) {
                return { data: null, error: err instanceof Error ? err.message : String(err) };
            }
        });
        this.GQLRequest = ({ variables, query }) => __awaiter(this, void 0, void 0, function* () {
            const headers = {
                'content-type': 'application/json',
                'x-hasura-admin-secret': locals_1.default.config().hasuraAdminSecret
            };
            return yield this.axios({
                url: `${locals_1.default.config().hasuraGraphqlURL}`,
                method: 'POST',
                headers: headers,
                data: {
                    query,
                    variables
                }
            });
        });
        this.encryptPassword = function (password) {
            return __awaiter(this, void 0, void 0, function* () {
                const pass = yield argon2_1.default.hash(password);
                return pass;
            });
        };
        this.verifyPassword = function (hash, password) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield argon2_1.default.verify(hash, password);
            });
        };
    }
}
exports.default = new Commons();
//# sourceMappingURL=commons.js.map