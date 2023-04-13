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
exports.UpdateLabReport = void 0;
const cloudinary_1 = __importDefault(require("../../../helpers/cloudinary"));
const commons_1 = __importDefault(require("../../commons"));
const mutations_1 = __importDefault(require("../../graphql/medical_history/mutations"));
function updateLabReport(lab_id, filename, new_lab_url, new_lab_public_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield commons_1.default.createAction({
            lab_id,
            filename,
            lab_url: new_lab_url,
            lab_public_id: new_lab_public_id,
        }, mutations_1.default.UPDATE_LAB_REPORT, 'update_lab_reports');
        console.log(data, '17');
        return { updateLabData: data, updateLabError: error };
    });
}
exports.UpdateLabReport = {
    handle(req, res) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { lab_id, filename, lab_url, lab_public_id } = ((_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.input) === null || _b === void 0 ? void 0 : _b.input) || ((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.input) || (req === null || req === void 0 ? void 0 : req.body);
                console.log(lab_id, filename, lab_url, lab_public_id);
                if (lab_public_id) {
                    yield cloudinary_1.default.cloudinaryDelete(lab_public_id);
                }
                let new_lab_url = '', new_lab_public_id = '';
                if (lab_url) {
                    const imageData = yield cloudinary_1.default.cloudinaryUpload(lab_url);
                    new_lab_url = imageData.eager[0].secure_url;
                    new_lab_public_id = imageData.public_id;
                }
                else {
                    new_lab_url = '';
                    new_lab_public_id = '';
                }
                console.log('hello', '46');
                const { updateLabData, updateLabError } = yield updateLabReport(lab_id, filename, new_lab_url, new_lab_public_id);
                if (updateLabError) {
                    return res.status(200).json({ status: false, message: updateLabError });
                }
                console.log(updateLabData);
                return res.status(200).json({
                    status: true,
                    message: `lab report is updated`,
                    data: updateLabData.returning[0],
                });
            }
            catch (error) {
                return res.status(200).json({ status: false, message: 'Something went wrong.' });
            }
        });
    },
};
module.exports = exports.UpdateLabReport.handle;
//# sourceMappingURL=index.js.map