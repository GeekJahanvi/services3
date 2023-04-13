/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Queries from '../../graphql/accounts/queries';
import Mutations from '../../graphql/accounts/mutations';
import Common from '../../commons';
import { Request, Response } from 'express';

interface AccountData {
  doctor_id: string;
  account_number: string;
}

interface AddAccountInput {
  doctor_id: string;
  bank_name: string;
  account_type_id: string;
  account_holder: string;
  account_number: string;
  IFSC_code: string;
}

async function resolveAccount({
  doctor_id,
  account_number
}: AccountData): Promise<{ accountData: any; accountErrors: any }> {
  const { data, error } = await Common.createAction(
    {
      doctor_id: doctor_id,
      account_number: account_number
    },
    Queries.ACCOUNT_EXISTS,
    'bank_account_details'
  );

  const account = data.length ? data[0] : null;
  return { accountData: account, accountErrors: error };
}

async function createAccount(input: AddAccountInput) {
  const { data, error } = await Common.createAction(
    {
      doctor_id: input.doctor_id,
      bank_name: input.bank_name,
      account_type_id: input.account_type_id,
      account_holder: input.account_holder,
      account_number: input.account_number,
      IFSC_code: input.IFSC_code
    },
    Mutations.ADD_ACCOUNT_DETAILS,
    'insert_bank_account_details'
  );
  return { account: data, errors: error };
}

export const AddAccount = {
  async handle(req: Request, res: Response) {
    try {
      const { doctor_id, bank_name, account_type_id, account_holder, account_number, IFSC_code } =
        // eslint-disable-next-line no-unsafe-optional-chaining
        req.body?.input?.input || req?.body?.input || req?.body;

      const { accountData, accountErrors } = await resolveAccount({
        doctor_id,
        account_number
      });

      if (accountErrors) {
        return res.status(400).json({ status: false, message: accountErrors });
      }

      if (accountData) {
        return res.status(400).json({ status: false, message: `Account already exists` });
      }

      const { account, errors } = await createAccount({
        doctor_id,
        bank_name,
        account_type_id,
        account_holder,
        account_number,
        IFSC_code
      });

      if (errors) {
        return res.status(400).json({ status: false, message: errors });
      }

      return res.status(200).json({
        status: true,
        message: `${account.returning[0].account_number} account number is added`,
        data: account.returning[0]
      });
    } catch (e) {
      return res.status(400).json({ status: false, message: 'Something went wrong.' });
    }
  }
};

module.exports = AddAccount.handle;
