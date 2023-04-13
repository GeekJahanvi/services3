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
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
const queries_1 = __importDefault(require("../../graphql/video-call/queries"));
const commons_1 = __importDefault(require("../../commons"));
const twilio_1 = __importDefault(require("twilio"));
const locals_1 = __importDefault(require("../../providers/locals"));
const TwilioAccountSid = locals_1.default.config().TwilioAccountSid;
const TwilioApiKey = locals_1.default.config().TwilioApiKey;
const TwilioApiSecret = locals_1.default.config().TwilioApiSecret;
const TwilioAuthToken = locals_1.default.config().TwilioAuthToken;
function resolveRoomID({ doctor_id, member_id }) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield commons_1.default.createAction({
            doctor_id: doctor_id,
            member_id: member_id,
        }, queries_1.default.GET_ACCESS_TOKEN, 'chat_room');
        const RoomID = data.length ? data[0] : null;
        return { RoomIDData: RoomID, RoomIDErrors: error };
    });
}
const GetAccessToken = {
    handle(req, res) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const AccessToken = twilio_1.default.jwt.AccessToken;
                const VideoGrant = AccessToken.VideoGrant;
                const { doctor_id, member_id } = ((_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.input) === null || _b === void 0 ? void 0 : _b.input) || ((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.input) || (req === null || req === void 0 ? void 0 : req.body);
                const { RoomIDData, RoomIDErrors } = yield resolveRoomID({ doctor_id, member_id });
                const id = RoomIDData.room_id;
                const identity = 'user@example.com';
                if (RoomIDErrors) {
                    return res.status(200).json({ status: false, message: "no room id found" });
                }
                if (!TwilioAccountSid || !TwilioApiKey || !TwilioApiSecret || !TwilioAuthToken) {
                    return res.status(400).json({ status: false, message: 'Unable to create access token' });
                }
                const token = new AccessToken(TwilioAccountSid, TwilioApiKey, TwilioApiSecret, { identity });
                const videoGrant = new VideoGrant({
                    room: id,
                });
                const accessToken = token.toJwt();
                if (token) {
                    token.addGrant(videoGrant);
                }
                const obj = {
                    room_id: id,
                    access_token: accessToken
                };
                return res.status(200).json({
                    status: true,
                    message: `AccessToken generated`,
                    returning: obj,
                });
            }
            catch (e) {
                return res.status(200).json({ status: false, message: 'Something went wrong.' });
            }
        });
    }
};
module.exports = GetAccessToken.handle;
//# sourceMappingURL=index.js.map