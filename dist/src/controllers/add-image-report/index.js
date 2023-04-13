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
function addImageReport(user_id, imagename, image_url, image_public_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield commons_1.default.createAction({
            user_id: user_id,
            imagename: imagename,
            image_url: image_url,
            image_public_id: image_public_id
        }, mutations_1.default.ADD_IMAGE_REPORTS, 'insert_image_reports');
        return { imageReportData: data, imageReportError: error };
    });
}
const AddImageReport = {
    handle(req, res) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("HELLO");
                const { user_id, imagename, image_url, image_public_id } = ((_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.input) === null || _b === void 0 ? void 0 : _b.input) || ((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.input) || (req === null || req === void 0 ? void 0 : req.body);
                console.log(user_id, imagename, image_url, image_public_id);
                let new_image_url = '', new_image_public_id = '';
                try {
                    const addImage = yield cloudinary_1.default.cloudinaryUpload(image_url);
                    new_image_url = addImage.eager[0].secure_url;
                    new_image_public_id = addImage.public_id;
                }
                catch (error) {
                    return res.status(200).json({ status: false, message: 'file not uploaded' });
                }
                const { imageReportData, imageReportError } = yield addImageReport(user_id, imagename, new_image_url, new_image_public_id);
                if (imageReportError) {
                    return res.status(200).json({ status: false, message: imageReportError.message });
                }
                return res.status(200).json({
                    status: true,
                    message: `image report is added`,
                    data: imageReportData === null || imageReportData === void 0 ? void 0 : imageReportData.returning[0]
                });
            }
            catch (e) {
                return res.status(200).json({ status: false, message: 'Something went wrong.' });
            }
        });
    }
};
module.exports = AddImageReport.handle;
//# sourceMappingURL=index.js.map