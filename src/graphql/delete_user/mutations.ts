class Mutations {
  DELETE_DOCTOR = `mutation delete_doctor($user_id: uuid!, $_eq1: Int = 3) {
        delete_users(where: {id: {_eq: $user_id}, _and: {role_id: {_eq: $_eq1}}}) {
          returning {
            id
            first_name
            last_name
          }
        }
      }`;

      DELETE_MEMBER = `mutation delete_user($member_id: uuid! ) {
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
         
        }`
}

export default new Mutations();
