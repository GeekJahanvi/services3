/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
// import { QueryResult } from 'pg';
import Queries from '../../graphql/delete_user/queries';
import Mutations from '../../graphql/delete_user/mutations';
import Common from '../../commons';
import Cloudinary from '../../../helpers/cloudinary';

interface Education {
  fellowship1_public_id?: string;
  fellowship2_public_id?: string;
  state_public_id?: string;
}

interface Certificate {
  certificate_public_id: string;
}

interface MedicalSchool {
  school_public_id: string;
}

interface User {
  profile_picture_public_id: string | null;
  user_educations: Education[];
  certificates: Certificate[];
  medical_schools: MedicalSchool[];
}

interface GetPublicIdResponse {
  idData: User[];
  idError: string | null;
}

// interface DeleteDoctorResponse {
//   deletedData: QueryResult;
//   deletedError: string | null;
// }

interface Input {
  input?: {
    input?: {
      user_id: string;
    };
  };
}

interface Body {
  user_id: string;
}

interface RequestWithInput extends Request {
  body: Input | Body;
}

interface RequestWithBody extends Request {
  body: Body;
}

async function getPublicIds(user_id: any)
{
  const { data, error } = await Common.createAction(
    {
      user_id: user_id,
    },
    Queries.GET_ALL_PUBLIC_IDS,
    'users',
  );

  return { idData: data, idErrors: error };
}

async function deleteDoctor(user_id: any)
{
  const { data, error } = await Common.createAction(
    {
      user_id: user_id,
    },
    Mutations.DELETE_DOCTOR,
    'delete_users',
  );

  return { deletedData: data, deletedError: error };
}

export const DeleteDoctor = {
  async handle(req: Request, res: Response) {
    try {
      const { user_id } = (req.body?.input?.input || req.body?.input || req.body) as { user_id: string };

      const {idData , idErrors} = await getPublicIds(user_id);

      if (idErrors) {
        return res.status(200).json({ status: false, message: idErrors });
      }

      const array1: string[] = [];

      if (idData.length !== 0) {
        const user = idData[0];

        if (user.profile_picture_public_id !== null) {
          array1.push(user.profile_picture_public_id);
        }

        const education = user.user_educations[0];

        if (education) {
          if (education.fellowship1_public_id) {
            array1.push(education.fellowship1_public_id);
          }

          if (education.fellowship2_public_id) {
            array1.push(education.fellowship2_public_id);
          }

          if (education.state_public_id) {
            array1.push(education.state_public_id);
          }
        }

        for (const certificate of user.certificates) {
          array1.push(certificate.certificate_public_id);
        }

        for (const medicalSchool of user.medical_schools) {
          array1.push(medicalSchool.school_public_id);
        }
      }

      if (array1.length !== 0) {
        await Cloudinary.cloudinaryDeleteAll(array1);
      }

      const { deletedData, deletedError } = await deleteDoctor(user_id);

      if (deletedError) {
        return res.status(200).json({ status: false, message: deletedError });
      }

      return res.status(200).json({ status: true, message: `doctor is deleted`, data: deletedData.returning[0] });
    } catch (error) {
      console.error(error);
      return res.status(200).json({ status: false, message: 'Something went wrong.' });
    }
  },
};

module.exports = DeleteDoctor.handle;
