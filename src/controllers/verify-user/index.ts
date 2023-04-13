/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */

import Queries from "../../graphql/auth/queries";
import Mutations from "../../graphql/auth/mutations";
import Common from "../../commons";

async function resolveOTP(user_id: any) {
  
  const { data, error } = await Common.createAction(
    {
        user_id: user_id
    },
    Queries.GET_OTP,
    "users",
  );
console.log(error);

  return { otpData: data, otpErrors: error };
}

async function verifyOtp(user_id: any) {
  const { data, error } = await Common.createAction(
    {
        user_id: user_id
    },
    Mutations.UPDATE_VERIFIED,
    "update_users",
  );
  return { verifyOtpData: data, verifyOtpErrors: error };
}

const VerifyUser = {
  async handle(req: { body: { input: { input: any; }; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { status: boolean; message: any; data?: any; }): any; new(): any; }; }; }) {
    try {
        const { otp, user_id } = req.body?.input?.input || req?.body?.input || req?.body;

        const { otpData, otpErrors } = await resolveOTP(user_id);
        if (otpErrors) {
            return res.status(200).json({ status: false, message: otpErrors });
        }

        if (otpData[0].otp === otp) {
            const { verifyOtpData, verifyOtpErrors } = await verifyOtp(user_id);

            if (verifyOtpErrors) {
                return res.status(200).json({ status: false, message: verifyOtpErrors });
            }
            const verifyData = verifyOtpData.returning[0];

            return res.status(200).json({ status: true, message: `OTP verified`, data: verifyData });
        } else {
            return res.status(200).json({ status: true, message: `OTP did not match`});
        }    
    } catch (e) {
        return res.status(200).json({ status: false, message: "Something went wrong." });
    }
  }
};

module.exports = VerifyUser.handle;