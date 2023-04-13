/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Mutations from '../../graphql/education/mutations';
import Common from '../../commons';
import { Request, Response } from 'express';
import Cloudinary from '../../../helpers/cloudinary';

interface UpdateUserMedicalSchoolInput {
  medical_school_id: string;
  medical_school_name: string;
  medical_school_url?: string;
  school_public_id?: string;
}

async function updateUserMedicalSchool({
  medical_school_id,
  medical_school_name,
  medical_school_url,
  school_public_id,
}: UpdateUserMedicalSchoolInput): Promise<{ medicalSchoolData: any; medicalSchoolErrors: any }> {

  const { data, error } = await Common.createAction(
    {
      medical_school_id,
      medical_school_name,
      medical_school_url,
      school_public_id,
    },
    Mutations.UPDATE_MEDICAL_SCHOOL,
    'update_medical_school'
  );

  return { medicalSchoolData: data, medicalSchoolErrors: error };
}

const UpdateMedicalSchool = {
  async handle(req: Request, res: Response) {
    try {
      const {
        medical_school_id,
        medical_school_name,
        medical_school_url,
        school_public_id,
      } = req.body?.input?.input || req?.body?.input || req?.body;

      if (school_public_id) {
        try {
          await Cloudinary.cloudinaryDelete(school_public_id);
        } catch (error) {
          return res.status(200).json({ status: false, message: error });
        }
      }

      let new_medical_school_url = '',
        new_medical_school_public_id = '';

      if (medical_school_url) {
        try {
          const medical_school_data = await Cloudinary.cloudinaryUpload(medical_school_url);
          new_medical_school_url = medical_school_data.eager[0].secure_url;
          new_medical_school_public_id = medical_school_data.public_id;
        } catch (error) {
          return res.status(200).json({ status: false, message: 'Files not uploaded' });
        }
      }

      const { medicalSchoolData, medicalSchoolErrors } = await updateUserMedicalSchool({
        medical_school_id,
        medical_school_name,
        medical_school_url: new_medical_school_url,
        school_public_id: new_medical_school_public_id,
      });

      if (medicalSchoolErrors) {
        return res.status(200).json({ status: false, message: medicalSchoolErrors });
      }

      return res
        .status(200)
        .json({ status: true, message: `Education data updated`, data: medicalSchoolData.returning[0] });
    } catch (error) {
      console.error(error);
      return res.status(200).json({ status: false, message: 'Something went wrong.' });
    }
  },
};

module.exports = UpdateMedicalSchool.handle;