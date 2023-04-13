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

interface AddMessageInput {
  [x: string]: any;
  chat_room_id: string;
  user_id: string;
  content: string;
  file_type: string;
}

interface CloudinaryUploadResponse {
  eager: { secure_url: string }[];
  public_id: string;
}

interface MessageData {
  returning: {
    id: string;
    chat_room_id: string;
    user_id: string;
    content: string;
    file_type: string;
    content_public_id: string;
  }[];
}

interface AddMessageResult {
  messageData?: MessageData;
  messageErrors?: any;
}

async function addMessage(
  chatRoomId: string,
  userId: string,
  contentUrl: string,
  fileType: string,
  contentPublicId: string
): Promise<AddMessageResult> {
  const { data, error } = await Common.createAction(
    {
      chat_room_id: chatRoomId,
      user_id: userId,
      content: contentUrl,
      file_type: fileType,
      content_public_id: contentPublicId
    },
    Mutations.ADD_MESSAGES,
    'insert_messages'
  );
  return { messageData: data, messageErrors: error };
}

const AddMessages = {
  async handle(req: Request, res: Response) {
    try {
      const { chat_room_id, user_id, content, file_type } =
        (req.body as AddMessageInput)?.input?.input || req?.body?.input || req?.body;

      let content_public_id = '',
        contentUrl = '';

      if (file_type !== 'text') {
        try {
          const contentMessage: CloudinaryUploadResponse = await Cloudinary.cloudinaryUpload(
            content
          );
          contentUrl = contentMessage.eager[0].secure_url;
          content_public_id = contentMessage.public_id;
        } catch (error) {
          return res.status(200).json({ status: false, message: 'file not uploaded' });
        }
      }

      const { messageData, messageErrors } = await addMessage(
        chat_room_id,
        user_id,
        contentUrl,
        file_type,
        content_public_id
      );

      if (messageErrors) {
        return res.status(200).json({ status: false, message: messageErrors });
      }

      return res
        .status(200)
        .json({ status: true, message: `message is added`, data: messageData?.returning[0] });
    } catch (e) {
      return res.status(200).json({ status: false, message: 'Something went wrong.' });
    }
  }
};

module.exports = AddMessages.handle;
