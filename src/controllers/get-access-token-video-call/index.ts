/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Queries from '../../graphql/video-call/queries';
import Common from '../../commons';
import { Request, Response } from 'express';
import twilio from 'twilio';
import Locals from '../../providers/locals';
const TwilioAccountSid = Locals.config().TwilioAccountSid;
const TwilioApiKey = Locals.config().TwilioApiKey;
const TwilioApiSecret = Locals.config().TwilioApiSecret;
const TwilioAuthToken = Locals.config().TwilioAuthToken;

interface ResolveRoomIDInput {
    doctor_id: string;
    member_id: string;
}

interface ResolveRoomIDOutput {
    RoomIDData: any;
    RoomIDErrors: any;
}

async function resolveRoomID({ doctor_id, member_id }: ResolveRoomIDInput): Promise<ResolveRoomIDOutput> {

    const { data, error } = await Common.createAction(
        {
            doctor_id: doctor_id,
            member_id: member_id,
        },
        Queries.GET_ACCESS_TOKEN,
        'chat_room',
    );

    const RoomID = data.length ? data[0] : null;

    return { RoomIDData: RoomID, RoomIDErrors: error };
}

const GetAccessToken = {
    async handle(req: Request, res: Response) {
        try {
            const AccessToken = twilio.jwt.AccessToken;
            const VideoGrant = AccessToken.VideoGrant;
            const { doctor_id, member_id } = req.body?.input?.input || req?.body?.input || req?.body;

            const { RoomIDData, RoomIDErrors } = await resolveRoomID({ doctor_id, member_id });

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
            }
            return res.status(200).json({
                status: true,
                message: `AccessToken generated`,
                returning: obj,
            });
        } catch (e) {
            return res.status(200).json({ status: false, message: 'Something went wrong.' });
        }
    }
};

module.exports = GetAccessToken.handle;