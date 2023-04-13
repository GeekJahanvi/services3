/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import Mutations from '../../graphql/auth/mutations';
import Common from '../../commons';

async function updatePassword(email: string, hash_password: string) {
  const { data, error } = await Common.createAction(
    {
      _eq: email,
      hash_password: hash_password
    },
    Mutations.RESET_PASSWORD,
    'update_users'
  );

  return { passwordData: data, passwordErrors: error };
}

const ResetPassword = {
  async handle(req: Request, res: Response) {
    try {
      const { email, password } = req.body?.input?.input || req?.body?.input || req?.body;

      const hash_password = await Common.encryptPassword(password);

      const { passwordData, passwordErrors } = await updatePassword(email, hash_password);

      if (passwordErrors) {
        return res.status(200).json({ status: false, message: passwordErrors });
      }

      return res
        .status(200)
        .json({ status: true, message: `Password updated`, data: passwordData.returning[0] });
    } catch (e) {
      return res.status(200).json({ status: false, message: 'Something went wrong.' });
    }
  }
};

module.exports = ResetPassword.handle;
