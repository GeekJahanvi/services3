"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Queries {
    constructor() {
        this.GET_ACCESS_TOKEN = `
    query get_access_token2($doctor_id: uuid! , $member_id: uuid!) {
    chat_room(where: {doctor_id: {_eq: $doctor_id}, member_id: {_eq: $member_id}}) {
      room_id
    }
  }`;
    }
}
exports.default = new Queries();
//# sourceMappingURL=queries.js.map