/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import Mutations from "../../graphql/education/mutations";
import Common from "../../commons";
import Cloudinary from "../../../helpers/cloudinary";

async function addEducationData(user_id: any, fellow_ship_1: any, fellow_ship_1_url: any, fellow_ship_2: any, fellow_ship_2_url: any, state_medical_license: any, state_medical_license_url: any, fellowship1_public_id: string, fellowship2_public_id: string, state_public_id: string) {
  const { data, error } = await Common.createAction(
    {
      user_id: user_id,
      fellow_ship_1: fellow_ship_1,
      fellow_ship_1_url: fellow_ship_1_url,
      fellow_ship_2: fellow_ship_2,
      fellow_ship_2_url: fellow_ship_2_url,
      state_medical_license: state_medical_license,
      state_medical_license_url: state_medical_license_url,
      fellowship1_public_id: fellowship1_public_id,
      fellowship2_public_id: fellowship2_public_id,
      state_public_id: state_public_id
    },
    Mutations.ADD_USER_EDUCATION,
    "insert_user_education"
  );
  return { educationData: data, educationErrors: error };
}

const AddUserEducation = {
  async handle(req: Request, res: Response) {
    try {
      const {
        user_id,
        fellow_ship_1,
        fellow_ship_1_url,
        fellow_ship_2,
        fellow_ship_2_url,
        state_medical_license,
        state_medical_license_url
      } = req.body?.input?.input || req?.body?.input || req?.body;

      let new_fellow_ship_1_url = "",
        new_fellow_ship_2_url = "",
        new_state_medical_license_url = "",
        fellowship1_public_id = "",
        fellowship2_public_id = "",
        state_public_id = "";

      if (fellow_ship_1_url) {
        const fellow_ship1 = await Cloudinary.cloudinaryUpload(fellow_ship_1_url);
        new_fellow_ship_1_url = fellow_ship1.eager[0].secure_url;
        fellowship1_public_id = fellow_ship1.public_id;
      }

      if (fellow_ship_2_url) {
        const fellow_ship2 = await Cloudinary.cloudinaryUpload(fellow_ship_2_url);
        new_fellow_ship_2_url = fellow_ship2.eager[0].secure_url;
        fellowship2_public_id = fellow_ship2.public_id;
      }

      if (state_medical_license_url) {
        const state_license = await Cloudinary.cloudinaryUpload(state_medical_license_url);
        new_state_medical_license_url = state_license.eager[0].secure_url;
        state_public_id = state_license.public_id;
      }

      const { educationData, educationErrors } = await addEducationData(
        user_id,
        fellow_ship_1,
        fellow_ship_1_url,
        fellow_ship_2,
        fellow_ship_2_url,
        state_medical_license,
        state_medical_license_url,
        fellowship1_public_id,
        fellowship2_public_id,
        state_public_id
      );

      if (educationErrors) {
        return res.status(200).json({ status: false, message: educationErrors });
      }

      return res
        .status(200)
        .json({ status: true, message: `education details added`, data: educationData.returning[0] });
    } catch (e) {
      return res.status(200).json({ status: false, message: "Something went wrong." });
    }
  }
};

module.exports = AddUserEducation.handle;
