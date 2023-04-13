/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */

import Queries from '../../graphql/auth/queries';
import Mutations from '../../graphql/auth/mutations';
import Common from '../../commons';
import Locals from '../../providers/locals';
import nodemailer from 'nodemailer';
import { Request, Response } from 'express';

async function updateOtp(user_id: string, otp1: number): Promise<{ otpData: any; otpErrors: any }> {
  
  const { data, error } = await Common.createAction(
    {
        user_id: user_id,
        otp: otp1
    },
    Mutations.UPDATE_OTP,
    "update_users",
  );

  return { otpData: data, otpErrors: error };
}

const UpdateOtp = {
  async handle(req: Request, res: Response) {
    try {
        const { user_id, email } =
        req.body?.input?.input || req?.body?.input || req?.body;

        const otp1 = Math.floor(1000 + Math.random() * 9000);
        try {
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
              console.log(error);
            } else {
              console.log(JSON.stringify(info));
            }
          });
        } catch (error) {
          return res.status(200).json({ status: false, message: 'otp not sent' });
        }

        const { otpData, otpErrors } = await updateOtp(user_id, otp1);

        if (otpErrors) {
            return res.status(200).json({ status: false, message: otpErrors });
        }

        return res.status(200).json({ status: true, message: `Otp updated`, data: otpData.returning[0] });
    } catch (e) {
        console.error(e);
        return res.status(200).json({ status: false, message: "Something went wrong." });
    }
  }
};

module.exports =  UpdateOtp.handle;