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
const cloudinary_1 = __importDefault(require("../../../helpers/cloudinary"));
const queries_1 = __importDefault(require("../../graphql/delete_user/queries"));
const mutations_1 = __importDefault(require("../../graphql/delete_user/mutations"));
function getPublicId(member_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield commons_1.default.createAction({
            member_id: member_id,
        }, queries_1.default.GET_MEMBER_PUBLIC_ID, "users");
        console.log(data, "line14");
        return { idData: data, idError: error };
    });
}
function deleteMember(member_id) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(member_id);
        const { data, error } = yield commons_1.default.createAction({
            member_id: member_id,
        }, mutations_1.default.DELETE_MEMBER, "delete_users");
        // console.log(data);
        console.log(data, "line27");
        return { deletedData: data, deletedError: error };
    });
}
const DeleteMember = {
    handle(req, res) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("hello", "31");
                const { member_id } = ((_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.input) === null || _b === void 0 ? void 0 : _b.input) || ((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.input) || (req === null || req === void 0 ? void 0 : req.body);
                console.log(member_id);
                const { idData, idError } = yield getPublicId(member_id);
                console.log("hellloooo");
                console.log(idData);
                if (idError) {
                    return res.status(200).json({ status: false, message: idError });
                }
                let array1 = [];
                if (idData.length != 0) {
                    if (idData[0].profile_picture_public_id != null) {
                        console.log("line45");
                        array1.push(idData.profile_picture_public_id);
                    }
                }
                console.log("heloooo", "57");
                console.log(idData);
                if (idData.length) {
                    for (let i = 0; i < idData[0].images.length; i++) {
                        array1[array1.length + i] = idData[0].images[i].image_public_id;
                    }
                    for (let i = 0; i < idData[0].labs.length; i++) {
                        array1[array1.length + i] = idData[0].labs[i].lab_public_id;
                    }
                    for (let i = 0; i < idData[0].medical_documents.length; i++) {
                        array1[array1.length + i] =
                            idData[0].medical_documents[i].document_public_id;
                    }
                }
                console.log(array1);
                if (array1.length !== 0) {
                    yield cloudinary_1.default.cloudinaryDeleteAll(array1);
                }
                //   console.log("hello","line57");
                const { deletedData, deletedError } = yield deleteMember(member_id);
                console.log(deletedData, "line82");
                if (deletedError) {
                    return res.status(200).json({ status: false, message: deletedError });
                }
                return res
                    .status(200)
                    .json({ status: true, message: `member is deleted`, data: deletedData.returning[0] });
            }
            catch (e) {
                return res.status(200).json({ status: false, message: "Something went wronggg." });
            }
        });
    },
};
module.exports = DeleteMember.handle;
//# sourceMappingURL=index.js.map