class Queries {
  CHECK_IF_USER_EXISTS = `query check_if_user_exists($_eq: String!) {
        users(where: {email: {_eq: $_eq}}) {
          email
          first_name
          country
          gender
          id
          phone
          last_name
          profile_picture
          hash_password
          role_id
          data_filled
          verified
        }
    }`;

  GET_OTP = `query get_otp($user_id: uuid) {
        users(where: {id: {_eq: $user_id}}) {
            otp
            role_id
        }
    }`;

  FORGOT_PASSWORD = `query forgot_password($email: String!) {
        users(where: {email: {_eq: $email}}) {
          email
          first_name
          country
          gender
          id
          phone
          last_name
          profile_picture
          hash_password
          role_id
          data_filled
          verified
        }
      }
      `;
}
export default new Queries();
