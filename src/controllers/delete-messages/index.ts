/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Request, Response } from 'express';
import Mutations from '../../graphql/messages/mutations';
import Common from '../../commons';
import Cloudinary from '../../../helpers/cloudinary';

interface DeleteMessageResult {
    deleteMessageData?: {
        returning: {
            id: string;
            chat_room_id: string;
            user_id: string;
            content: string;
            file_type: string;
            content_public_id: string;
        }[];
    };
    deleteMessageErrors?: any;
}

async function deleteMessages(message_id: string): Promise<DeleteMessageResult> {
    const { data, error } = await Common.createAction(
        {
            message_id: message_id
        },
        Mutations.DELETE_MESSAGES,
        'delete_messages'
    );

    return { deleteMessageData: data, deleteMessageErrors: error };
}

const DeleteMessages = {
    async handle(req: Request, res: Response) {
        try {
            const { message_id, file_type, content_public_id } =
                (req.body?.input?.input || req?.body?.input || req?.body) as {
                    message_id: string;
                    file_type: string;
                    content_public_id: string;
                };

            if (file_type !== 'text' && content_public_id !== '') {
                try {
                    await Cloudinary.cloudinaryDelete(content_public_id);
                } catch (error) {
                    return res.status(400).json({
                        status: false,
                        message: error
                    });
                }
            }

            const { deleteMessageData, deleteMessageErrors } = await deleteMessages(message_id);

            if (deleteMessageErrors) {
                return res.status(200).json({ status: false, message: deleteMessageErrors });
            }

            return res.status(200).json({
                status: true,
                message: `message deleted`,
                returning: deleteMessageData.returning[0]
            });
        } catch (e) {
            return res.status(200).json({ status: false, message: 'Something went wrong.' });
        }
    }
};

module.exports = DeleteMessages.handle;