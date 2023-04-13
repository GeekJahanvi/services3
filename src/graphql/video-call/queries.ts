class Queries {
  GET_ACCESS_TOKEN = `
    query get_access_token2($doctor_id: uuid! , $member_id: uuid!) {
    chat_room(where: {doctor_id: {_eq: $doctor_id}, member_id: {_eq: $member_id}}) {
      room_id
    }
  }`;
}
export default new Queries();
