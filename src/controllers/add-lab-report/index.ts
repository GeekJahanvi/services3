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

interface AddLabReportRequestBody {
  input?: {
    input?: {
      user_id: string;
      filename: string;
      lab_url: string;
      lab_public_id: string;
    };
  };
}

interface LabReportData {
  returning: {
    id: string;
    user_id: string;
    filename: string;
    lab_url: string;
    lab_public_id: string;
    created_at: string;
    updated_at: string;
  }[];
}

interface LabReportError {
  message: string;
}

interface AddLabReportResponse {
  status: boolean;
  message: string;
  data?: LabReportData['returning'][0];
}

async function addLabReport(
  user_id: string,
  filename: string,
  lab_url: string,
  lab_public_id: string
) {
  const { data, error } = await Common.createAction(
    {
      user_id: user_id,
      filename: filename,
      lab_url: lab_url,
      lab_public_id: lab_public_id
    },
    Mutations.ADD_LABS_REPORTS,
    'insert_lab_reports'
  );

  return { labReportData: data, labReportError: error };
}

const AddLabReport = {
  async handle(req: Request, res: Response) {
    try {
      console.log("HELLO");
      
      console.log(req.body.input);
      
      const { user_id,  filename,lab_url} =
        (req.body as AddLabReportRequestBody)?.input?.input || req?.body?.input || req?.body;
console.log(user_id, filename,lab_url);

      let new_lab_url = '',
        new_lab_public_id = '';
      try {
        const addlab = await Cloudinary.cloudinaryUpload(lab_url);
        new_lab_url = addlab.eager[0].secure_url;
        new_lab_public_id = addlab.public_id;
      } catch (error) {
        return res.status(200).json({ status: false, message: 'file not uploaded' });
      }

      const { labReportData, labReportError } = await addLabReport(
        user_id,
  filename,
  new_lab_url,
  new_lab_public_id
      );

      if (labReportError) {
        return res.status(200).json({ status: false, message: labReportError });
      }
      return res.status(200).json({
        status: true,
        message: `lab report is added`,
        data: labReportData?.returning[0]
      });
    } catch (e) {
      return res.status(200).json({ status: false, message: 'Something went wrong.' });
    }
  }
};

module.exports = AddLabReport.handle;
