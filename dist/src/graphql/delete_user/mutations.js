"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Mutations {
    constructor() {
        this.DELETE_DOCTOR = `mutation delete_doctor($user_id: uuid!, $_eq1: Int = 3) {
        delete_users(where: {id: {_eq: $user_id}, _and: {role_id: {_eq: $_eq1}}}) {
          returning {
            id
            first_name
            last_name
          }
        }
      }`;
        this.DELETE_MEMBER = `mutation delete_user($member_id: uuid! ) {
        delete_appointments(where: {member_id: {_eq: $member_id}}) {
          returning {
            timeslot_id
          }
        }
          delete_users(where: {id: {_eq: $member_id}}) {
            returning {
              id
            }
          }
         
        }`;
    }
}
exports.default = new Mutations();
//# sourceMappingURL=mutations.js.map