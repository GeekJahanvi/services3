class Mutations {
  CREATE_USER = `mutation create_user($email: String!, $first_name: String!, $last_name: String!,$hash_password: String!, $role_id: Int!, $otp: Int = 10) {
    insert_users_one(object: {email: $email, first_name: $first_name, last_name: $last_name, hash_password: $hash_password, role_id: $role_id, otp: $otp}) {
      email
      first_name
      gender
      hash_password
      last_name
      id
      phone
      profile_picture
      role_id
      verified
    }
    }`;

  UPDATE_VERIFIED = `mutation update_verified($user_id: uuid!, $verified: Boolean = true) {
    update_users(where: {id: {_eq: $user_id}}, _set: {verified: $verified}) {
      returning {
        verified
      }
    }
    }`;

  UPDATE_OTP = `mutation update_otp($user_id: uuid!, $otp: Int!) {
        update_users(where: {id: {_eq: $user_id}}, _set: {otp: $otp}) {
            returning {
                id
            }
        }
    }`;

  RESET_PASSWORD = `mutation reset_password($_eq: String!, $hash_password: String!) {
      update_users(where: {email: {_eq: $_eq}}, _set: {hash_password: $hash_password}) {
        returning {
          email
          first_name
          hash_password
          id
        }
      }
    }`;

  UPDATE_CHANGE_PASSWORD = `
    mutation update_change_password($user_id: uuid! , $hash_password: String! ) {
      update_users(where: {id: {_eq: $user_id}}, _set: {hash_password: $hash_password}) {
        returning {
          hash_password
        }
      }
    }
    `;
}
export default new Mutations();
