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
exports.DeleteDoctor = void 0;
// import { QueryResult } from 'pg';
const queries_1 = __importDefault(require("../../graphql/delete_user/queries"));
const mutations_1 = __importDefault(require("../../graphql/delete_user/mutations"));
const commons_1 = __importDefault(require("../../commons"));
const cloudinary_1 = __importDefault(require("../../../helpers/cloudinary"));
function getPublicIds(user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield commons_1.default.createAction({
            user_id: user_id,
        }, queries_1.default.GET_ALL_PUBLIC_IDS, 'users');
        return { idData: data, idErrors: error };
    });
}
function deleteDoctor(user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield commons_1.default.createAction({
            user_id: user_id,
        }, mutations_1.default.DELETE_DOCTOR, 'delete_users');
        return { deletedData: data, deletedError: error };
    });
}
exports.DeleteDoctor = {
    handle(req, res) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user_id } = (((_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.input) === null || _b === void 0 ? void 0 : _b.input) || ((_c = req.body) === null || _c === void 0 ? void 0 : _c.input) || req.body);
                const { idData, idErrors } = yield getPublicIds(user_id);
                if (idErrors) {
                    return res.status(200).json({ status: false, message: idErrors });
                }
                const array1 = [];
                if (idData.length !== 0) {
                    const user = idData[0];
                    if (user.profile_picture_public_id !== null) {
                        array1.push(user.profile_picture_public_id);
                    }
                    const education = user.user_educations[0];
                    if (education) {
                        if (education.fellowship1_public_id) {
                            array1.push(education.fellowship1_public_id);
                        }
                        if (education.fellowship2_public_id) {
                            array1.push(education.fellowship2_public_id);
                        }
                        if (education.state_public_id) {
                            array1.push(education.state_public_id);
                        }
                    }
                    for (const certificate of user.certificates) {
                        array1.push(certificate.certificate_public_id);
                    }
                    for (const medicalSchool of user.medical_schools) {
                        array1.push(medicalSchool.school_public_id);
                    }
                }
                if (array1.length !== 0) {
                    yield cloudinary_1.default.cloudinaryDeleteAll(array1);
                }
                const { deletedData, deletedError } = yield deleteDoctor(user_id);
                if (deletedError) {
                    return res.status(200).json({ status: false, message: deletedError });
                }
                return res.status(200).json({ status: true, message: `doctor is deleted`, data: deletedData.returning[0] });
            }
            catch (error) {
                console.error(error);
                return res.status(200).json({ status: false, message: 'Something went wrong.' });
            }
        });
    },
};
module.exports = exports.DeleteDoctor.handle;
//# sourceMappingURL=index.js.map