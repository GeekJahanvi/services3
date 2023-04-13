class Mutations {
  ADD_ACCOUNT_DETAILS = `mutation add_account_details($doctor_id: uuid!, $account_type_id: uuid!, $account_number: numeric!, $account_holder: String!, $IFSC_code: String!, $bank_name: String!) {
      insert_bank_account_details(objects: {user_id: $doctor_id, account_type_id: $account_type_id, account_number: $account_number, account_holder: $account_holder, IFSC_code: $IFSC_code, bank: {data: {bank_name: $bank_name}}}) {
        returning {
          bank {
            bank_name
            id
          }
          account_type {
            account_type
          }
          account_number
          account_holder
          IFSC_code
          id
        }
      }
    }`;
}

export default new Mutations();
