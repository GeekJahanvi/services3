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
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
const mutations_1 = __importDefault(require("../../graphql/education/mutations"));
const commons_1 = __importDefault(require("../../commons"));
const cloudinary_1 = __importDefault(require("../../../helpers/cloudinary"));
function updateUserStateLicense({ state_medical_license_id, state_medical_license, state_medical_license_url, state_public_id, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield commons_1.default.createAction({
            state_medical_license_id,
            state_medical_license,
            state_medical_license_url,
            state_public_id,
        }, mutations_1.default.UPDATE_USER_EDUCATION_STATE_MEDICAL_LICENSE, 'update_user_education');
        return { stateLicenseData: data, stateLicenseErrors: error };
    });
}
const UpdateUserEducationStateMedicalLicense = {
    handle(req, res) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { state_medical_license_id, state_medical_license, state_medical_license_url } = ((_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.input) === null || _b === void 0 ? void 0 : _b.input) || ((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.input) || (req === null || req === void 0 ? void 0 : req.body);
                let state_public_id = '';
                const { stateLicenseData, stateLicenseErrors } = yield updateUserStateLicense({
                    state_medical_license_id,
                    state_medical_license,
                    state_medical_license_url,
                    state_public_id,
                });
                if (stateLicenseErrors) {
                    return res.status(200).json({ status: false, message: stateLicenseErrors });
                }
                if (stateLicenseData.returning[0].state_public_id) {
                    try {
                        yield cloudinary_1.default.cloudinaryDelete(stateLicenseData.returning[0].state_public_id);
                    }
                    catch (error) {
                        return res.status(200).json({ status: false, message: error });
                    }
                }
                let new_state_medical_license_url = '', new_state_public_id = '';
                if (state_medical_license_url) {
                    try {
                        const medical_license_data = yield cloudinary_1.default.cloudinaryUpload(state_medical_license_url);
                        new_state_medical_license_url = medical_license_data.eager[0].secure_url;
                        new_state_public_id = medical_license_data.public_id;
                    }
                    catch (error) {
                        return res.status(200).json({ status: false, message: 'Files not uploaded' });
                    }
                }
                let result = [];
                const { stateLicenseData: updatedData, stateLicenseErrors: updatedErrors } = yield updateUserStateLicense({
                    state_medical_license_id,
                    state_medical_license,
                    state_medical_license_url: new_state_medical_license_url,
                    state_public_id: new_state_public_id,
                });
                result = updatedData.returning[0];
                if (updatedErrors) {
                    return res.status(200).json({ status: false, message: 'editedErrors' });
                }
                console.log(result);
                return res.status(200).json({
                    status: true,
                    message: `Education data updated`,
                    data: result,
                });
            }
            catch (e) {
                return res.status(200).json({ status: false, message: 'Something went wrong.' });
            }
        });
    },
};
module.exports = UpdateUserEducationStateMedicalLicense.handle;
//# sourceMappingURL=index.js.map