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
const mutations_1 = __importDefault(require("../../graphql/medical_history/mutations"));
const cloudinary_1 = __importDefault(require("../../../helpers/cloudinary"));
function addMedicalDocument(user_id, document_name, document_url, document_public_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield commons_1.default.createAction({
            user_id: user_id,
            document_name: document_name,
            document_url: document_url,
            document_public_id: document_public_id
        }, mutations_1.default.ADD_MEDICAL_DOCUMENT, 'insert_medical_documents');
        return { medicalDocumentData: data, medicalDocumentError: error };
    });
}
const AddMedicalDocument = {
    handle(req, res) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("HELLO");
                const { user_id, document_name, document_url, document_public_id } = ((_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.input) === null || _b === void 0 ? void 0 : _b.input) || ((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.input) || (req === null || req === void 0 ? void 0 : req.body);
                console.log(user_id, document_name, document_url, document_public_id);
                let new_document_url = '', new_document_public_id = '';
                try {
                    const addDocument = yield cloudinary_1.default.cloudinaryUpload(document_url);
                    new_document_url = addDocument.eager[0].secure_url;
                    new_document_public_id = addDocument.public_id;
                }
                catch (error) {
                    return res.status(200).json({ status: false, message: 'file not uploaded' });
                }
                const { medicalDocumentData, medicalDocumentError } = yield addMedicalDocument(user_id, document_name, new_document_url, new_document_public_id);
                if (medicalDocumentError) {
                    return res.status(200).json({ status: false, message: medicalDocumentError.message });
                }
                return res.status(200).json({
                    status: true,
                    message: `document is added`,
                    data: medicalDocumentData === null || medicalDocumentData === void 0 ? void 0 : medicalDocumentData.returning[0]
                });
            }
            catch (e) {
                return res.status(200).json({ status: false, message: 'Something went wrong.' });
            }
        });
    }
};
module.exports = AddMedicalDocument.handle;
//# sourceMappingURL=index.js.map