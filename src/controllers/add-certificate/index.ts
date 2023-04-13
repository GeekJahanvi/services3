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

interface AddCertificateRequestBody {
  input?: {
    input?: {
      user_id: string;
      certificate_name: string;
      certificate_url: string;
      certificate_public_id: string;
    };
  };
}

interface CertificateData {
  returning: {
    id: string;
    user_id: string;
    certificate_name: string;
    certificate_url: string;
    certificate_public_id: string;
    created_at: string;
    updated_at: string;
  }[];
}

interface CertificateError {
  message: string;
}

interface AddCertificateResponse {
  status: boolean;
  message: string;
  data?: CertificateData['returning'][0];
}

async function addCertificate(
  user_id: string,
  certificate_name: string,
  certificate_url: string,
  certificate_public_id: string
) {
  const { data, error } = await Common.createAction(
    {
      user_id: user_id,
      certificate_name: certificate_name,
      certificate_url: certificate_url,
      certificate_public_id: certificate_public_id
    },
    Mutations.ADD_CERTIFICATE,
    'insert_certificates'
  );

  return { certificateData: data, certificateError: error };
}

const AddCertificate = {
  async handle(req: Request, res: Response) {
    try {
      console.log("HELLO");
      
      const { user_id,  certificate_name,certificate_url,certificate_public_id } =
        (req.body as AddCertificateRequestBody)?.input?.input || req?.body?.input || req?.body;
console.log(user_id,  certificate_name,certificate_url,certificate_public_id);

      let new_certificate_url = '',
        new_certificate_public_id = '';
      try {
        const addImage = await Cloudinary.cloudinaryUpload(certificate_url);
        new_certificate_url = addImage.eager[0].secure_url;
        new_certificate_public_id = addImage.public_id;
      } catch (error) {
        return res.status(200).json({ status: false, message: 'file not uploaded' });
      }

      const { certificateData, certificateError } = await addCertificate(
        user_id,
        certificate_name,
        new_certificate_url,
        new_certificate_public_id
      );

      if (certificateError) {
        return res.status(200).json({ status: false, message: certificateError });
      }
      return res.status(200).json({
        status: true,
        message: `certificate is added`,
        data: certificateData?.returning[0]
      });
    } catch (e) {
      return res.status(200).json({ status: false, message: 'Something went wrong.' });
    }
  }
};

module.exports = AddCertificate.handle;
