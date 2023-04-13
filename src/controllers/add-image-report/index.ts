/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import Common from '../../commons';
import Mutations from '../../graphql/medical_history/mutations';
import Cloudinary from '../../../helpers/cloudinary';

interface AddImageReportRequestBody {
  input?: {
    input?: {
      user_id: string;
      document_name: string;
      document_url: string;
      document_public_id: string;
    };
  };
}

interface ImageReportData {
  returning: {
    id: string;
    user_id: string;
    document_name: string;
    document_url: string;
    document_public_id: string;
    created_at: string;
    updated_at: string;
  }[];
}

interface ImageReportError {
  message: string;
}

interface AddImageReportResponse {
  status: boolean;
  message: string;
  data?: ImageReportData['returning'][0];
}

async function addImageReport(
  user_id: string,
  imagename: string,
  image_url: string,
  image_public_id: string
): Promise<{ imageReportData: any; imageReportError: any }> {
  const { data, error } = await Common.createAction(
    {
      user_id: user_id,
      imagename: imagename,
      image_url: image_url,
      image_public_id: image_public_id
    },
    Mutations.ADD_IMAGE_REPORTS,
    'insert_image_reports'
  );

  return { imageReportData: data, imageReportError: error };
}

const AddImageReport = {
  async handle(req: Request, res: Response) {
    try {
      console.log("HELLO");
      
      const { user_id,  imagename,image_url,image_public_id } =
        (req.body as AddImageReportRequestBody)?.input?.input || req?.body?.input || req?.body;
console.log(user_id, imagename,image_url,image_public_id);

      let new_image_url = '',
        new_image_public_id = '';
      try {
        const addImage = await Cloudinary.cloudinaryUpload(image_url);
        new_image_url = addImage.eager[0].secure_url;
        new_image_public_id = addImage.public_id;
      } catch (error) {
        return res.status(200).json({ status: false, message: 'file not uploaded' });
      }

      const { imageReportData, imageReportError } = await addImageReport(
        user_id,
  imagename,
  new_image_url,
  new_image_public_id
      );

      if (imageReportError) {
        return res.status(200).json({ status: false, message: imageReportError.message });
      }
      return res.status(200).json({
        status: true,
        message: `image report is added`,
        data: imageReportData?.returning[0]
      });
    } catch (e) {
      return res.status(200).json({ status: false, message: 'Something went wrong.' });
    }
  }
};

module.exports = AddImageReport.handle;
