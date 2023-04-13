/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import Common from '../../commons';
import Queries from '../../graphql/auth/queries';
import Mutations from '../../graphql/auth/mutations';

async function resolveChangePassword(email: string): Promise<{ passwordData: any, passwordErrors: any }> {
    const { data, error } = await Common.createAction(
        {
            email: email
        },
        Queries.FORGOT_PASSWORD,
        'users'
    );
    const password = data.length ? data[0] : null;
    return { passwordData: password, passwordErrors: error };
}

async function ProfileDetails(user_id: string,
    hash_password: string): Promise<{ password: any, errors: any }> {
    const { data, error } = await Common.createAction(
        {
            user_id: user_id,
            hash_password: hash_password,
        },
        Mutations.UPDATE_CHANGE_PASSWORD,
        'update_users'
    );
    return { password: data, errors: error };
}

const UpdateChangePassword = {
    async handle(req: Request, res: Response) {
        try {
            const { input } = req.body || {};
            const { user_id, current_password, email, new_password } = input?.input ?? input ?? {};
            const hash_password = await Common.encryptPassword(new_password);
            const { passwordData, passwordErrors } = await resolveChangePassword(email);

            if (passwordErrors) {
                return res.status(200).json({ status: false, message: passwordErrors });
            }

            if (await Common.verifyPassword(passwordData.hash_password, current_password)) {
                const { password, errors } = await ProfileDetails(user_id, hash_password);
                if (errors) {
                    return res.status(200).json({ status: false, message: errors });
                }
                const changePassword = password.returning[0];
                if (!changePassword) {
                    return res.status(400).json({
                        status: false,
                        message: 'Password not changed'
                    });
                } else {
                    return res.status(200).json({
                        status: true,
                        message: 'password changed',
                        returning: password.returning[0]
                    });
                }

            } else {
                return res.status(400).json(
                    {
                        status: false,
                        message: 'current password is wrong'
                    }
                );
            }
        } catch (e) {
            return res.status(200).json({ status: false, message: 'Something went wrong.' });
        }
    }
};

module.exports = UpdateChangePassword.handle;
