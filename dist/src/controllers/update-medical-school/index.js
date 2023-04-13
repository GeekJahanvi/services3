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
const mutations_1 = __importDefault(require("../../graphql/education/mutations"));
const commons_1 = __importDefault(require("../../commons"));
const cloudinary_1 = __importDefault(require("../../../helpers/cloudinary"));
function updateUserMedicalSchool({ medical_school_id, medical_school_name, medical_school_url, school_public_id, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield commons_1.default.createAction({
            medical_school_id,
            medical_school_name,
            medical_school_url,
            school_public_id,
        }, mutations_1.default.UPDATE_MEDICAL_SCHOOL, 'update_medical_school');
        return { medicalSchoolData: data, medicalSchoolErrors: error };
    });
}
const UpdateMedicalSchool = {
    handle(req, res) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { medical_school_id, medical_school_name, medical_school_url, school_public_id, } = ((_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.input) === null || _b === void 0 ? void 0 : _b.input) || ((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.input) || (req === null || req === void 0 ? void 0 : req.body);
                if (school_public_id) {
                    try {
                        yield cloudinary_1.default.cloudinaryDelete(school_public_id);
                    }
                    catch (error) {
                        return res.status(200).json({ status: false, message: error });
                    }
                }
                let new_medical_school_url = '', new_medical_school_public_id = '';
                if (medical_school_url) {
                    try {
                        const medical_school_data = yield cloudinary_1.default.cloudinaryUpload(medical_school_url);
                        new_medical_school_url = medical_school_data.eager[0].secure_url;
                        new_medical_school_public_id = medical_school_data.public_id;
                    }
                    catch (error) {
                        return res.status(200).json({ status: false, message: 'Files not uploaded' });
                    }
                }
                const { medicalSchoolData, medicalSchoolErrors } = yield updateUserMedicalSchool({
                    medical_school_id,
                    medical_school_name,
                    medical_school_url: new_medical_school_url,
                    school_public_id: new_medical_school_public_id,
                });
                if (medicalSchoolErrors) {
                    return res.status(200).json({ status: false, message: medicalSchoolErrors });
                }
                return res
                    .status(200)
                    .json({ status: true, message: `Education data updated`, data: medicalSchoolData.returning[0] });
            }
            catch (error) {
                console.error(error);
                return res.status(200).json({ status: false, message: 'Something went wrong.' });
            }
        });
    },
};
module.exports = UpdateMedicalSchool.handle;
//# sourceMappingURL=index.js.map