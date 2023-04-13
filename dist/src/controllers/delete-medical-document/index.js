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
const mutations_1 = __importDefault(require("../../graphql/medical_history/mutations"));
const commons_1 = __importDefault(require("../../commons"));
const cloudinary_1 = __importDefault(require("../../../helpers/cloudinary"));
function deleteMedicalDocument(medical_document_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield commons_1.default.createAction({
            medical_document_id: medical_document_id
        }, mutations_1.default.DELETE_MEDICAL_DOCUMENT, 'delete_medical_documents');
        console.log(medical_document_id);
        console.log(data, "line27");
        return { deletedData: data, deletedError: error };
    });
}
const DeleteMedicalDocument = {
    handle(req, res) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { medical_document_id } = ((_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.input) === null || _b === void 0 ? void 0 : _b.input) || ((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.input) || (req === null || req === void 0 ? void 0 : req.body);
                const { deletedData, deletedError } = yield deleteMedicalDocument(medical_document_id);
                console.log(deletedData.returning[0], "line26");
                if (deletedError) {
                    return res.status(200).json({ status: false, message: deletedError });
                }
                if (deletedData.returning[0].document_public_id) {
                    console.log("hello");
                    yield cloudinary_1.default.cloudinaryDelete(deletedData.returning[0].document_public_id);
                }
                return res.status(200).json({ status: true, message: 'medical document deleted', data: deletedData.returning[0] });
            }
            catch (e) {
                return res.status(200).json({ status: false, message: 'Something went wrong.' });
            }
        });
    }
};
module.exports = DeleteMedicalDocument.handle;
//# sourceMappingURL=index.js.map