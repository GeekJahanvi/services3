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
function addLabReport(user_id, filename, lab_url, lab_public_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield commons_1.default.createAction({
            user_id: user_id,
            filename: filename,
            lab_url: lab_url,
            lab_public_id: lab_public_id
        }, mutations_1.default.ADD_LABS_REPORTS, 'insert_lab_reports');
        return { labReportData: data, labReportError: error };
    });
}
const AddLabReport = {
    handle(req, res) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("HELLO");
                console.log(req.body.input);
                const { user_id, filename, lab_url } = ((_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.input) === null || _b === void 0 ? void 0 : _b.input) || ((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.input) || (req === null || req === void 0 ? void 0 : req.body);
                console.log(user_id, filename, lab_url);
                let new_lab_url = '', new_lab_public_id = '';
                try {
                    const addlab = yield cloudinary_1.default.cloudinaryUpload(lab_url);
                    new_lab_url = addlab.eager[0].secure_url;
                    new_lab_public_id = addlab.public_id;
                }
                catch (error) {
                    return res.status(200).json({ status: false, message: 'file not uploaded' });
                }
                const { labReportData, labReportError } = yield addLabReport(user_id, filename, new_lab_url, new_lab_public_id);
                if (labReportError) {
                    return res.status(200).json({ status: false, message: labReportError });
                }
                return res.status(200).json({
                    status: true,
                    message: `lab report is added`,
                    data: labReportData === null || labReportData === void 0 ? void 0 : labReportData.returning[0]
                });
            }
            catch (e) {
                return res.status(200).json({ status: false, message: 'Something went wrong.' });
            }
        });
    }
};
module.exports = AddLabReport.handle;
//# sourceMappingURL=index.js.map