"use strict";
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
const mutations_1 = __importDefault(require("../../graphql/messages/mutations"));
const commons_1 = __importDefault(require("../../commons"));
const cloudinary_1 = __importDefault(require("../../../helpers/cloudinary"));
function deleteMessages(message_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield commons_1.default.createAction({
            message_id: message_id
        }, mutations_1.default.DELETE_MESSAGES, 'delete_messages');
        return { deleteMessageData: data, deleteMessageErrors: error };
    });
}
const DeleteMessages = {
    handle(req, res) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { message_id, file_type, content_public_id } = (((_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.input) === null || _b === void 0 ? void 0 : _b.input) || ((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.input) || (req === null || req === void 0 ? void 0 : req.body));
                if (file_type !== 'text' && content_public_id !== '') {
                    try {
                        yield cloudinary_1.default.cloudinaryDelete(content_public_id);
                    }
                    catch (error) {
                        return res.status(400).json({
                            status: false,
                            message: error
                        });
                    }
                }
                const { deleteMessageData, deleteMessageErrors } = yield deleteMessages(message_id);
                if (deleteMessageErrors) {
                    return res.status(200).json({ status: false, message: deleteMessageErrors });
                }
                return res.status(200).json({
                    status: true,
                    message: `message deleted`,
                    returning: deleteMessageData.returning[0]
                });
            }
            catch (e) {
                return res.status(200).json({ status: false, message: 'Something went wrong.' });
            }
        });
    }
};
module.exports = DeleteMessages.handle;
//# sourceMappingURL=index.js.map