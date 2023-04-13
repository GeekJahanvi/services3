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
exports.UpdateImageReport = void 0;
const commons_1 = __importDefault(require("../../commons"));
const mutations_1 = __importDefault(require("../../graphql/medical_history/mutations"));
const cloudinary_1 = __importDefault(require("../../../helpers/cloudinary"));
function updateImageReport(image_id, imagename, new_image_url, new_image_public_id) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(image_id, imagename, new_image_url, new_image_public_id);
        const { data, error } = yield commons_1.default.createAction({
            image_id: image_id,
            imagename: imagename,
            image_url: new_image_url,
            image_public_id: new_image_public_id
        }, mutations_1.default.UPDATE_IMAGE_REPORT, 'update_image_reports');
        console.log(data, '17');
        return { updateImageData: data, updateImageError: error };
    });
}
exports.UpdateImageReport = {
    handle(req, res) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { image_id, imagename, image_url, image_public_id } = ((_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.input) === null || _b === void 0 ? void 0 : _b.input) || ((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.input) || (req === null || req === void 0 ? void 0 : req.body);
                if (image_public_id) {
                    yield cloudinary_1.default.cloudinaryDelete(image_public_id);
                }
                let new_image_url = '', new_image_public_id = '';
                if (image_url) {
                    const imageData = yield cloudinary_1.default.cloudinaryUpload(image_url);
                    new_image_url = imageData.eager[0].secure_url;
                    new_image_public_id = imageData.public_id;
                }
                else {
                    new_image_url = '';
                    new_image_public_id = '';
                }
                const { updateImageData, updateImageError } = yield updateImageReport(image_id, imagename, new_image_url, new_image_public_id);
                if (updateImageError) {
                    return res.status(200).json({ status: false, message: updateImageError });
                }
                console.log(updateImageData);
                return res.status(200).json({ status: true, message: `image report is updated`, data: updateImageData.returning[0] });
            }
            catch (error) {
                return res.status(200).json({ status: false, message: 'Something went wrong.' });
            }
        });
    }
};
module.exports = exports.UpdateImageReport.handle;
//# sourceMappingURL=index.js.map