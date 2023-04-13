/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Mutations from '../../graphql/medical_history/mutations';
import Common from '../../commons';
import Cloudinary from '../../../helpers/cloudinary';
import { Request, Response } from 'express';

interface DeleteImageReportResult {
  deletedData: any;
  deletedError: any;
}

async function deleteCertificate(certificate_id: string) {
  const { data, error } = await Common.createAction(
    {
      certificate_id: certificate_id
    },
    Mutations.DELETE_CERTIFICATE,
    'delete_certificates'
  );
  console.log(data, "line27");
  return { deletedData: data, deletedError: error };
}

const DeleteCertificate = {
  async handle(req: Request, res: Response) {
    try {
      const { certificate_id } = req.body?.input?.input ?? req?.body?.input ?? req?.body;

      const { deletedData, deletedError } = await deleteCertificate(certificate_id);

      console.log(deletedData.returning[0], "line26");
      if (deletedError) {
        return res.status(200).json({ status: false, message: deletedError });
      }
      if (deletedData.returning[0].certificate_public_id) {
        console.log("hello");
        await Cloudinary.cloudinaryDelete(deletedData.returning[0].certificate_public_id);
      }
      return res.status(200).json({ status: true, message: 'certificate report deleted', data: deletedData.returning[0] });
    }
    catch (e) {
      return res.status(200).json({ status: false, message: 'Something went wrong.' });
    }
  }
};

module.exports =  DeleteCertificate.handle;
