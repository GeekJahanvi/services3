/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Locals from './providers/locals';
import argon2 from 'argon2';

class Commons {
  private axios = require('axios');

  public createAction = async (
    input: object,
    mutationGql: string,
    mutationName: string
  ): Promise<{ data: any; error: string | null }> => {
    try {
      
      const { data, errors } = await this.GQLRequest({
        variables: { ...input },
        query: mutationGql
      });
      let error: string | undefined;

      if (!data || !data?.data || !data?.data[mutationName]) {
        error =
          errors || data.errors[0].message || `Something went wrong in mutation ${mutationName}`;
      }

      const dataError = errors ? errors : error;
      const axiosData = dataError ? null : data?.data[mutationName];

      return {
        data: axiosData,
        error: dataError || null
      };
    } catch (err: unknown) {
      return { data: null, error: err instanceof Error ? err.message : String(err) };
    }
  };

  private GQLRequest = async ({
    variables,
    query
  }: {
    variables: object;
    query: string;
  }): Promise<{ data: any; errors: any }> => {
    const headers = {
      'content-type': 'application/json',
      'x-hasura-admin-secret': Locals.config().hasuraAdminSecret
    };

    return await this.axios({
      url: `${Locals.config().hasuraGraphqlURL}`,
      method: 'POST',
      headers: headers,
      data: {
        query,
        variables
      }
    });
  };

  public encryptPassword = async function (password: string): Promise<string> {
    const pass = await argon2.hash(password);
    return pass;
  };

  public verifyPassword = async function (hash: string, password: string): Promise<boolean> {
    return await argon2.verify(hash, password);
  };
}

export default new Commons();
