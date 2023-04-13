/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import Cloudinary from "../../../helpers/cloudinary";
import Common from "../../commons";
import Mutations from "../../graphql/education/mutations";

async function updateUserMedicalDocuments(
  medical_document_id: string,
  document_name: string,
  new_medical_document_url: string,
  new_medical_document_public_id: string
): Promise<{ medicalDocumentsData: any; medicalDocumentsErrors: any }> {
  const { data, error } = await Common.createAction(
    {
      medical_document_id: medical_document_id,
      document_name: document_name,
      document_url: new_medical_document_url,
      document_public_id: new_medical_document_public_id,
    },
    Mutations.UPDATE_MEDICAL_DOCUMENTS,
    "update_medical_documents"
  );

  return { medicalDocumentsData: data, medicalDocumentsErrors: error };
}

const UpdateMedicalDocuments = {
  async handle(req: Request, res: Response) {
    try {
      const { medical_document_id, document_name, document_url, document_public_id } =
        req.body?.input?.input || req?.body?.input || req?.body;

      if (document_public_id) {
        try {
          await Cloudinary.cloudinaryDelete(document_public_id);
        } catch (error) {
          return res.status(200).json({ status: false, message: error });
        }
      }

      let new_medical_document_url = "",
        new_medical_document_public_id = "";

      if (document_url) {
        try {
          const medical_document_data = await Cloudinary.cloudinaryUpload(document_url);
          new_medical_document_url = medical_document_data.eager[0].secure_url;
          new_medical_document_public_id = medical_document_data.public_id;
        } catch (error) {
          return res.status(200).json({ status: false, message: "Files not uploaded" });
        }
      }
      const { medicalDocumentsData, medicalDocumentsErrors } = await updateUserMedicalDocuments(
        medical_document_id,
        document_name,
        new_medical_document_url,
        new_medical_document_public_id
      );

      if (medicalDocumentsErrors) {
        return res.status(200).json({ status: false, message: medicalDocumentsErrors });
      }

      return res.status(200).json({ status: true, message: `Education data updated`, data: medicalDocumentsData.returning[0] });
    } catch (e) {
      return res.status(200).json({ status: false, message: "Something went wrong." });
    }
  },
};

module.exports = UpdateMedicalDocuments.handle;
