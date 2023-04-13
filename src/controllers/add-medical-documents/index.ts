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

interface AddMedicalDocumentRequestBody {
  input?: {
    input?: {
      user_id: string;
      document_name: string;
      document_url: string;
      document_public_id: string;
    };
  };
}

interface MedicalDocumentData {
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

interface MedicalDocumentError {
  message: string;
}

interface AddMedicalDocumentResponse {
  status: boolean;
  message: string;
  data?: MedicalDocumentData['returning'][0];
}

async function addMedicalDocument(
  user_id: string,
  document_name: string,
  document_url: string,
  document_public_id: string
): Promise<{ medicalDocumentData: any; medicalDocumentError: any }> {
  const { data, error } = await Common.createAction(
    {
      user_id: user_id,
      document_name: document_name,
      document_url: document_url,
      document_public_id: document_public_id
    },
    Mutations.ADD_MEDICAL_DOCUMENT,
    'insert_medical_documents'
  );

  return { medicalDocumentData: data, medicalDocumentError: error };
}

const AddMedicalDocument = {
  async handle(req: Request, res: Response<AddMedicalDocumentResponse>) {
    try {
      console.log("HELLO");
      
      const { user_id, document_name, document_url, document_public_id } =
        (req.body as AddMedicalDocumentRequestBody)?.input?.input || req?.body?.input || req?.body;
console.log(user_id, document_name, document_url, document_public_id);

      let new_document_url = '',
        new_document_public_id = '';
      try {
        const addDocument = await Cloudinary.cloudinaryUpload(document_url);
        new_document_url = addDocument.eager[0].secure_url;
        new_document_public_id = addDocument.public_id;
      } catch (error) {
        return res.status(200).json({ status: false, message: 'file not uploaded' });
      }

      const { medicalDocumentData, medicalDocumentError } = await addMedicalDocument(
        user_id,
        document_name,
        new_document_url,
        new_document_public_id
      );

      if (medicalDocumentError) {
        return res.status(200).json({ status: false, message: medicalDocumentError.message });
      }
      return res.status(200).json({
        status: true,
        message: `document is added`,
        data: medicalDocumentData?.returning[0]
      });
    } catch (e) {
      return res.status(200).json({ status: false, message: 'Something went wrong.' });
    }
  }
};

module.exports = AddMedicalDocument.handle;
