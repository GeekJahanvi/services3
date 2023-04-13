"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Queries {
    constructor() {
        this.CHECK_IF_USER_EXISTS = `query check_if_user_exists($_eq: String!) {
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
        this.GET_OTP = `query get_otp($user_id: uuid) {
        users(where: {id: {_eq: $user_id}}) {
            otp
            role_id
        }
    }`;
        this.FORGOT_PASSWORD = `query forgot_password($email: String!) {
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
}
exports.default = new Queries();
//# sourceMappingURL=queries.js.map