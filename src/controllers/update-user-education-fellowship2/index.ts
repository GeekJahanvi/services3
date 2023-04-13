/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import Mutations from '../../graphql/education/mutations';
import Common from '../../commons';
import { Request, Response } from 'express';
import Cloudinary from '../../../helpers/cloudinary';


async function updateUserFellowship2(
  fellow_ship_2_id: any,
  fellow_ship_2: any,
  new_fellow_ship_2_url: any,
  new_fellowship2_public_id: any,
): Promise<{ fellowship2Data: any; fellowship2Errors: any }> {
  const { data, error } = await Common.createAction(
    {
      fellow_ship_2_id,
      fellow_ship_2_url: new_fellow_ship_2_url ? new_fellow_ship_2_url : '',
      fellowship2_public_id: new_fellowship2_public_id ? new_fellowship2_public_id : '',
      fellow_ship_2,
    },
    Mutations.UPDATE_USER_EDUCATION_FELLOWSHIP2,
    'update_user_education'
  );

  return { fellowship2Data: data, fellowship2Errors: error };
}

const UpdateUserEducation = {
  async handle(req: Request, res: Response) {
    try {
      const { fellow_ship_2_id, fellow_ship_2, fellow_ship_2_url } = req.body?.input?.input || req?.body?.input || req?.body;

      const fellowship2_public_id = '';

      const { fellowship2Data, fellowship2Errors } = await updateUserFellowship2(
        fellow_ship_2_id,
        fellow_ship_2,
        fellow_ship_2_url,
        fellowship2_public_id,
      );

      if (fellowship2Errors) {
        return res.status(200).json({ status: false, message: fellowship2Errors });
      }

      if (fellowship2Data.returning[0].fellowship2_public_id) {
        try {
          await Cloudinary.cloudinaryDelete(fellowship2Data.returning[0].fellowship2_public_id);
        } catch (error) {
          return res.status(200).json({ status: false, message: error });
        }
      }

      let new_fellowship2_url = '',
        new_fellowship2_public_id = '';

      if (fellow_ship_2_url) {
        try {
          const fellowship2_data = await Cloudinary.cloudinaryUpload(fellow_ship_2_url);
          new_fellowship2_url = fellowship2_data.eager[0].secure_url;
          new_fellowship2_public_id = fellowship2_data.public_id;
        } catch (error) {
          return res.status(200).json({ status: false, message: 'Files not uploaded' });
        }

        const { fellowship2Data, fellowship2Errors } = await updateUserFellowship2(
          fellow_ship_2_id,
          fellow_ship_2,
          new_fellowship2_url,
          new_fellowship2_public_id,
        );

        if (fellowship2Errors) {
          return res.status(200).json({ status: false, message: fellowship2Errors });
        }
      }

      return res.status(200).json({ status: true, message: 'Education data updated', data: fellowship2Data.returning[0] });
    } catch (e) {
      return res.status(200).json({ status: false, message: "Something went wrong." });
    }
  }
};

module.exports = UpdateUserEducation.handle;