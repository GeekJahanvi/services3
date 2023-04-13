/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import  Common  from '../../commons';
import  Mutations  from '../../graphql/medical_history/mutations';
import  Cloudinary  from '../../../helpers/cloudinary';

interface DeleteLabReportResponse {
  status: boolean;
  message: string;
  data?: LabReport;
}

interface LabReport {
  lab_public_id?: string;
  // add other properties here as needed
}

async function deleteLabReport(lab_report_id: number){
  const { data, error } = await Common.createAction(
    {
      lab_report_id,
    },
    Mutations.DELETE_LAB_REPORT,
    'delete_lab_reports'
  );
  console.log(data, "line27");
  return { deletedData: data, deletedError: error };
}

const DeleteLabReport = {
  async handle(req: Request, res: Response){
    try {
      const { lab_report_id } = req.body?.input?.input ?? req?.body?.input ?? req?.body;

      const { deletedData, deletedError } = await deleteLabReport(lab_report_id);

      console.log(deletedData?.returning[0], "line26");
      if (deletedError) {
        return res.status(200).json({ status: false, message: deletedError });
      }
      if (deletedData?.returning[0]?.lab_public_id) {
        console.log("hello");
        await Cloudinary.cloudinaryDelete(deletedData.returning[0].lab_public_id);
      }
      return res.status(200).json({ status: true, message: 'lab report deleted', data: deletedData?.returning[0] });
    } catch (e) {
      return res.status(200).json({ status: false, message: 'Something went wrong.' });
    }
  }
};

module.exports =  DeleteLabReport.handle;
