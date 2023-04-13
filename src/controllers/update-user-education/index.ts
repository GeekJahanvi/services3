/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import Mutations from '../../graphql/education/mutations';
import Common from '../../commons';
import { Request, Response } from 'express';
import Cloudinary from '../../../helpers/cloudinary';

async function updateUserEducation(
  doctorId: string,
  fellowship1: string | null | undefined,
  fellowship1Url: string | null | undefined,
  fellowship2: string | null | undefined,
  fellowship2Url: string | null | undefined,
  stateMedicalLicense: string | null | undefined,
  stateMedicalLicenseUrl: string | null | undefined,
  newFellowship1PublicId: string | null | undefined,
  newFellowship2PublicId: string | null | undefined,
  newStatePublicId: string | null | undefined,
) {
  const { data, error } = await Common.createAction(
    {
      doctor_id: doctorId,
      fellow_ship_1: fellowship1,
      fellow_ship_1_url: fellowship1Url,
      fellow_ship_2: fellowship2,
      fellow_ship_2_url: fellowship2Url,
      state_medical_license: stateMedicalLicense,
      state_medical_license_url: stateMedicalLicenseUrl,
      fellowship1_public_id: newFellowship1PublicId,
      fellowship2_public_id: newFellowship2PublicId,
      state_public_id: newStatePublicId,
    },
    Mutations.UPDATE_USER_EDUCATION,
    'update_user_education',
  );
  return { educationData: data, educationErrors: error };
}

const UpdateUserEducation = {
  async handle(req: Request, res: Response) {
    try {
      const {
        doctor_id,
        fellow_ship_1,
        fellow_ship_1_url,
        fellow_ship_2,
        fellow_ship_2_url,
        state_medical_license,
        state_medical_license_url,
        fellowship1_public_id,
        fellowship2_public_id,
        state_public_id,
      } = req.body?.input?.input || req?.body?.input || req?.body;

      const publicIds = [
        fellowship1_public_id,
        fellowship2_public_id,
        state_public_id,
      ].filter((publicId) => publicId);

      try {
        await Cloudinary.cloudinaryDeleteAll(publicIds);
      } catch (error) {
        return res
          .status(200)
          .json({ status: false, message: 'Files not deleted' });
      }

      let new_fellow_ship_1_url = '',
        new_fellow_ship_2_url = '',
        new_state_medical_license_url = '',
        new_fellowship1_public_id = '',
        new_state_public_id = '',
        new_fellowship2_public_id = '';

      if (fellow_ship_1_url) {
        try {
          const fellow_ship1 = await Cloudinary.cloudinaryUpload(
            fellow_ship_1_url,
          );
          new_fellow_ship_1_url = fellow_ship1.eager[0].secure_url;
          new_fellowship1_public_id = fellow_ship1.public_id;
        } catch (error) {
          return res
            .status(200)
            .json({ status: false, message: 'Files not  uploaded' });
        }
      } else {
        new_fellow_ship_1_url = '';
        new_fellowship1_public_id = '';
      }

      if (fellow_ship_2_url) {
        try {
          const fellow_ship2 = await Cloudinary.cloudinaryUpload(fellow_ship_2_url);
          new_fellow_ship_2_url = fellow_ship2.eager[0].secure_url;
          new_fellowship2_public_id = fellow_ship2.public_id;

        } catch (error) {
          return res.status(200).json({ status: false, message: "Files not uploaded" });
        }
      }
      else {
        new_fellow_ship_2_url = '';
        new_fellowship2_public_id = '';
      }
      if (state_medical_license_url) {
        try {
          const state_license = await Cloudinary.cloudinaryUpload(state_medical_license_url);
          new_state_medical_license_url = state_license.eager[0].secure_url;
          new_state_public_id = state_license.public_id;
        } catch (error) {
          return res.status(200).json({ status: false, message: "Files not uploaded" });
        }
      }
      else {
        new_state_medical_license_url = '';
        new_state_public_id = '';
      }

      const { educationData, educationErrors } = await updateUserEducation(doctor_id, fellow_ship_1, new_fellow_ship_1_url, fellow_ship_2, new_fellow_ship_2_url, state_medical_license, new_state_medical_license_url, new_fellowship1_public_id, new_fellowship2_public_id, new_state_public_id);

      if (educationErrors) {
        return res.status(200).json({ status: false, message: 'educationErrors' });
      }

      return res.status(200).json({ status: true, message: `Education data updated`, data: educationData.returning[0] });
    }
    catch (e) {
      return res.status(200).json({ status: false, message: "Something went wrong." });
    }
  }
};

module.exports = UpdateUserEducation.handle;