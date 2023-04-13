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
const cloudinary_1 = __importDefault(require("../../../helpers/cloudinary"));
const commons_1 = __importDefault(require("../../commons"));
const mutations_1 = __importDefault(require("../../graphql/education/mutations"));
function updateUserMedicalDocuments(medical_document_id, document_name, new_medical_document_url, new_medical_document_public_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield commons_1.default.createAction({
            medical_document_id: medical_document_id,
            document_name: document_name,
            document_url: new_medical_document_url,
            document_public_id: new_medical_document_public_id,
        }, mutations_1.default.UPDATE_MEDICAL_DOCUMENTS, "update_medical_documents");
        return { medicalDocumentsData: data, medicalDocumentsErrors: error };
    });
}
const UpdateMedicalDocuments = {
    handle(req, res) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { medical_document_id, document_name, document_url, document_public_id } = ((_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.input) === null || _b === void 0 ? void 0 : _b.input) || ((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.input) || (req === null || req === void 0 ? void 0 : req.body);
                if (document_public_id) {
                    try {
                        yield cloudinary_1.default.cloudinaryDelete(document_public_id);
                    }
                    catch (error) {
                        return res.status(200).json({ status: false, message: error });
                    }
                }
                let new_medical_document_url = "", new_medical_document_public_id = "";
                if (document_url) {
                    try {
                        const medical_document_data = yield cloudinary_1.default.cloudinaryUpload(document_url);
                        new_medical_document_url = medical_document_data.eager[0].secure_url;
                        new_medical_document_public_id = medical_document_data.public_id;
                    }
                    catch (error) {
                        return res.status(200).json({ status: false, message: "Files not uploaded" });
                    }
                }
                const { medicalDocumentsData, medicalDocumentsErrors } = yield updateUserMedicalDocuments(medical_document_id, document_name, new_medical_document_url, new_medical_document_public_id);
                if (medicalDocumentsErrors) {
                    return res.status(200).json({ status: false, message: medicalDocumentsErrors });
                }
                return res.status(200).json({ status: true, message: `Education data updated`, data: medicalDocumentsData.returning[0] });
            }
            catch (e) {
                return res.status(200).json({ status: false, message: "Something went wrong." });
            }
        });
    },
};
module.exports = UpdateMedicalDocuments.handle;
//# sourceMappingURL=index.js.map