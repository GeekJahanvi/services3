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
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
const mutations_1 = __importDefault(require("../../graphql/education/mutations"));
const commons_1 = __importDefault(require("../../commons"));
const cloudinary_1 = __importDefault(require("../../../helpers/cloudinary"));
function updateUserFellowship2(fellow_ship_2_id, fellow_ship_2, new_fellow_ship_2_url, new_fellowship2_public_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield commons_1.default.createAction({
            fellow_ship_2_id,
            fellow_ship_2_url: new_fellow_ship_2_url ? new_fellow_ship_2_url : '',
            fellowship2_public_id: new_fellowship2_public_id ? new_fellowship2_public_id : '',
            fellow_ship_2,
        }, mutations_1.default.UPDATE_USER_EDUCATION_FELLOWSHIP2, 'update_user_education');
        return { fellowship2Data: data, fellowship2Errors: error };
    });
}
const UpdateUserEducation = {
    handle(req, res) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fellow_ship_2_id, fellow_ship_2, fellow_ship_2_url } = ((_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.input) === null || _b === void 0 ? void 0 : _b.input) || ((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.input) || (req === null || req === void 0 ? void 0 : req.body);
                const fellowship2_public_id = '';
                const { fellowship2Data, fellowship2Errors } = yield updateUserFellowship2(fellow_ship_2_id, fellow_ship_2, fellow_ship_2_url, fellowship2_public_id);
                if (fellowship2Errors) {
                    return res.status(200).json({ status: false, message: fellowship2Errors });
                }
                if (fellowship2Data.returning[0].fellowship2_public_id) {
                    try {
                        yield cloudinary_1.default.cloudinaryDelete(fellowship2Data.returning[0].fellowship2_public_id);
                    }
                    catch (error) {
                        return res.status(200).json({ status: false, message: error });
                    }
                }
                let new_fellowship2_url = '', new_fellowship2_public_id = '';
                if (fellow_ship_2_url) {
                    try {
                        const fellowship2_data = yield cloudinary_1.default.cloudinaryUpload(fellow_ship_2_url);
                        new_fellowship2_url = fellowship2_data.eager[0].secure_url;
                        new_fellowship2_public_id = fellowship2_data.public_id;
                    }
                    catch (error) {
                        return res.status(200).json({ status: false, message: 'Files not uploaded' });
                    }
                    const { fellowship2Data, fellowship2Errors } = yield updateUserFellowship2(fellow_ship_2_id, fellow_ship_2, new_fellowship2_url, new_fellowship2_public_id);
                    if (fellowship2Errors) {
                        return res.status(200).json({ status: false, message: fellowship2Errors });
                    }
                }
                return res.status(200).json({ status: true, message: 'Education data updated', data: fellowship2Data.returning[0] });
            }
            catch (e) {
                return res.status(200).json({ status: false, message: "Something went wrong." });
            }
        });
    }
};
module.exports = UpdateUserEducation.handle;
//# sourceMappingURL=index.js.map