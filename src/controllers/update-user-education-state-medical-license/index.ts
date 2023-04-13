/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import Mutations from '../../graphql/education/mutations';
import Common from '../../commons';
import { Request, Response } from 'express';
import Cloudinary from '../../../helpers/cloudinary';

interface UpdateUserStateLicenseInput {
  state_medical_license_id: string;
  state_medical_license: string;
  state_medical_license_url?: string;
  state_public_id?: string;
}

async function updateUserStateLicense({
  state_medical_license_id,
  state_medical_license,
  state_medical_license_url,
  state_public_id,
}: UpdateUserStateLicenseInput) {

  const { data, error } = await Common.createAction(
    {
      state_medical_license_id,
      state_medical_license,
      state_medical_license_url,
      state_public_id,
    },
    Mutations.UPDATE_USER_EDUCATION_STATE_MEDICAL_LICENSE,
    'update_user_education'
  );

  return { stateLicenseData: data, stateLicenseErrors: error };
}

const UpdateUserEducationStateMedicalLicense = {
  async handle(req: Request, res: Response) {
    try {
      const { state_medical_license_id, state_medical_license, state_medical_license_url } =
        req.body?.input?.input || req?.body?.input || req?.body;

      let state_public_id = '';

      const { stateLicenseData, stateLicenseErrors } = await updateUserStateLicense({
        state_medical_license_id,
        state_medical_license,
        state_medical_license_url,
        state_public_id,
      });

      if (stateLicenseErrors) {
        return res.status(200).json({ status: false, message: stateLicenseErrors });
      }

      if (stateLicenseData.returning[0].state_public_id) {
        try {
          await Cloudinary.cloudinaryDelete(stateLicenseData.returning[0].state_public_id);
        } catch (error) {
          return res.status(200).json({ status: false, message: error });
        }
      }

      let new_state_medical_license_url = '',
        new_state_public_id = '';

      if (state_medical_license_url) {
        try {
          const medical_license_data = await Cloudinary.cloudinaryUpload(state_medical_license_url);
          new_state_medical_license_url = medical_license_data.eager[0].secure_url;
          new_state_public_id = medical_license_data.public_id;
        } catch (error) {
          return res.status(200).json({ status: false, message: 'Files not uploaded' });
        }
      }
      let result: string[] = [];
      const { stateLicenseData: updatedData, stateLicenseErrors: updatedErrors } = await updateUserStateLicense({
        state_medical_license_id,
        state_medical_license,
        state_medical_license_url: new_state_medical_license_url,
        state_public_id: new_state_public_id,
      });
      result = updatedData.returning[0];

      if (updatedErrors) {
        return res.status(200).json({ status: false, message: 'editedErrors' });
      }

      console.log(result);

      return res.status(200).json({
        status: true,
        message: `Education data updated`,
        data: result,
      });
    } catch (e) {
      return res.status(200).json({ status: false, message: 'Something went wrong.' });
    }
  },
};

module.exports = UpdateUserEducationStateMedicalLicense.handle;