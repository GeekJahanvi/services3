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
const mutations_1 = __importDefault(require("../../graphql/education/mutations"));
const commons_1 = __importDefault(require("../../commons"));
const cloudinary_1 = __importDefault(require("../../../helpers/cloudinary"));
function addEducationData(user_id, fellow_ship_1, fellow_ship_1_url, fellow_ship_2, fellow_ship_2_url, state_medical_license, state_medical_license_url, fellowship1_public_id, fellowship2_public_id, state_public_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield commons_1.default.createAction({
            user_id: user_id,
            fellow_ship_1: fellow_ship_1,
            fellow_ship_1_url: fellow_ship_1_url,
            fellow_ship_2: fellow_ship_2,
            fellow_ship_2_url: fellow_ship_2_url,
            state_medical_license: state_medical_license,
            state_medical_license_url: state_medical_license_url,
            fellowship1_public_id: fellowship1_public_id,
            fellowship2_public_id: fellowship2_public_id,
            state_public_id: state_public_id
        }, mutations_1.default.ADD_USER_EDUCATION, "insert_user_education");
        return { educationData: data, educationErrors: error };
    });
}
const AddUserEducation = {
    handle(req, res) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user_id, fellow_ship_1, fellow_ship_1_url, fellow_ship_2, fellow_ship_2_url, state_medical_license, state_medical_license_url } = ((_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.input) === null || _b === void 0 ? void 0 : _b.input) || ((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.input) || (req === null || req === void 0 ? void 0 : req.body);
                let new_fellow_ship_1_url = "", new_fellow_ship_2_url = "", new_state_medical_license_url = "", fellowship1_public_id = "", fellowship2_public_id = "", state_public_id = "";
                if (fellow_ship_1_url) {
                    const fellow_ship1 = yield cloudinary_1.default.cloudinaryUpload(fellow_ship_1_url);
                    new_fellow_ship_1_url = fellow_ship1.eager[0].secure_url;
                    fellowship1_public_id = fellow_ship1.public_id;
                }
                if (fellow_ship_2_url) {
                    const fellow_ship2 = yield cloudinary_1.default.cloudinaryUpload(fellow_ship_2_url);
                    new_fellow_ship_2_url = fellow_ship2.eager[0].secure_url;
                    fellowship2_public_id = fellow_ship2.public_id;
                }
                if (state_medical_license_url) {
                    const state_license = yield cloudinary_1.default.cloudinaryUpload(state_medical_license_url);
                    new_state_medical_license_url = state_license.eager[0].secure_url;
                    state_public_id = state_license.public_id;
                }
                const { educationData, educationErrors } = yield addEducationData(user_id, fellow_ship_1, fellow_ship_1_url, fellow_ship_2, fellow_ship_2_url, state_medical_license, state_medical_license_url, fellowship1_public_id, fellowship2_public_id, state_public_id);
                if (educationErrors) {
                    return res.status(200).json({ status: false, message: educationErrors });
                }
                return res
                    .status(200)
                    .json({ status: true, message: `education details added`, data: educationData.returning[0] });
            }
            catch (e) {
                return res.status(200).json({ status: false, message: "Something went wrong." });
            }
        });
    }
};
module.exports = AddUserEducation.handle;
//# sourceMappingURL=index.js.map