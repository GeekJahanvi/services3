"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Queries {
    constructor() {
        this.ACCOUNT_EXISTS = `query ($doctor_id: uuid!, $account_number: numeric!) {
      bank_account_details(where: {user_id: {_eq: $doctor_id}, _and: {account_number: {_eq: $account_number}}}) {
        bank {
          bank_name
        }
        account_type {
          account_type
        }
        account_number
        account_holder
        IFSC_code
        id
      }
    }`;
    }
}
exports.default = new Queries();
//# sourceMappingURL=queries.js.map