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
const mutations_1 = __importDefault(require("../../graphql/messages/mutations"));
const commons_1 = __importDefault(require("../../commons"));
const cloudinary_1 = __importDefault(require("../../../helpers/cloudinary"));
function addMessage(chatRoomId, userId, contentUrl, fileType, contentPublicId) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield commons_1.default.createAction({
            chat_room_id: chatRoomId,
            user_id: userId,
            content: contentUrl,
            file_type: fileType,
            content_public_id: contentPublicId
        }, mutations_1.default.ADD_MESSAGES, 'insert_messages');
        return { messageData: data, messageErrors: error };
    });
}
const AddMessages = {
    handle(req, res) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { chat_room_id, user_id, content, file_type } = ((_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.input) === null || _b === void 0 ? void 0 : _b.input) || ((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.input) || (req === null || req === void 0 ? void 0 : req.body);
                let content_public_id = '', contentUrl = '';
                if (file_type !== 'text') {
                    try {
                        const contentMessage = yield cloudinary_1.default.cloudinaryUpload(content);
                        contentUrl = contentMessage.eager[0].secure_url;
                        content_public_id = contentMessage.public_id;
                    }
                    catch (error) {
                        return res.status(200).json({ status: false, message: 'file not uploaded' });
                    }
                }
                const { messageData, messageErrors } = yield addMessage(chat_room_id, user_id, contentUrl, file_type, content_public_id);
                if (messageErrors) {
                    return res.status(200).json({ status: false, message: messageErrors });
                }
                return res
                    .status(200)
                    .json({ status: true, message: `message is added`, data: messageData === null || messageData === void 0 ? void 0 : messageData.returning[0] });
            }
            catch (e) {
                return res.status(200).json({ status: false, message: 'Something went wrong.' });
            }
        });
    }
};
module.exports = AddMessages.handle;
//# sourceMappingURL=index.js.map