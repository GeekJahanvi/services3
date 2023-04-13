/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
import nodemailer from 'nodemailer';
import { Request, Response } from 'express';
import Queries from '../../graphql/auth/queries';
import Mutations from '../../graphql/auth/mutations';
import Common from '../../commons';
import Locals from '../../providers/locals';

interface UserData {
  email: string;
  first_name: string;
  last_name: string;
  hash_password: string;
  role_id: string;
  otp: number;
}

interface SignupInput {
  email: string;
  fullname: string;
  password: string;
  role_id: string;
}

interface SignupResponse {
  status: boolean;
  message: string;
  data?: UserData;
}

async function resolveUser(email: string): Promise<{ userData: UserData | null; userErrors: any }> {
  const { data, error } = await Common.createAction(
    {
      _eq: email
    },
    Queries.CHECK_IF_USER_EXISTS,
    'users'
  );

  const user = data.length ? data[0] : null;
  return { userData: user, userErrors: error };
}

async function createUser(
  email: string,
  fullname: string,
  hash_password: string,
  role_id: string,
  otp1: number
) {
  const { data, error } = await Common.createAction(
    {
      email,
      first_name: fullname.split(' ')[0],
      last_name: fullname.split(' ')[1],
      hash_password,
      role_id,
      otp: otp1
    },
    Mutations.CREATE_USER,
    'insert_users_one'
  );
  return { createUserData: data, createUserErrors: error };
}

const Signup = {
  async handle(req: Request, res: Response<SignupResponse>) {
    try {
      const { email, fullname, password, role_id } =
        req.body?.input?.input || req?.body?.input || req?.body;

      const { userData, userErrors } = await resolveUser(email);

      if (userErrors) {
        return res.status(200).json({ status: false, message: userErrors });
      }

      if (userData) {
        return res
          .status(200)
          .json({ status: false, message: `User with this email already exists` });
      }

      const hash_password = await Common.encryptPassword(password);
      const otp1 = Math.floor(1000 + Math.random() * 9000);

      try {
        const otp1 = Math.floor(1000 + Math.random() * 9000);
        const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: Locals.config().userEmail,
            pass: Locals.config().userEmailPass
          }
        });

        const mailOptions = {
          from: Locals.config().userEmail,
          to: email,
          subject: 'Sending Email using Node.js',
          html: `<h1>hello your otp for login is ${otp1}</h1>`,
          text: 'Heelooo'
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            return res.status(200).json({ status: false, message: 'error in transporter' });
          } else {
            console.log(JSON.stringify(info));
          }
        });
      } catch (error) {
        return res.status(200).json({ status: false, message: 'otp not sent' });
      }

      const { createUserData, createUserErrors } = await createUser(
        email,
        fullname,
        hash_password,
        role_id,
        otp1
      );
      
      if (createUserErrors) {
        return res.status(200).json({ status: false, message: createUserErrors });
      }
      return res.status(200).json({ status: true, message: `User Added`, data: createUserData });
    } catch (e) {
      return res.status(200).json({ status: false, message: 'Something went wrong.' });
    }
  }
};

module.exports = Signup.handle;
