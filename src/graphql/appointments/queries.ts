class Queries {
  CHECK_TIMESLOT = `query check_timeslot($timeslot_id: uuid!) {
        timeslots(where: {id: {_eq: $timeslot_id}}) {
          booked
        }
      }`;
  GET_UPCOMING_APPOINTMENTS_MEMBER_PORTAL_TOMORROW = `query get_upcoming_appointments_member_portal_tomorrow($member_id: uuid!, $date: date!){
        appointments(where: {member_id: {_eq: $member_id}, _and: {appointment_date: {_gt: $date}, _and: {cancel: {_eq: false}}}}) {
          id
          time
          appointment_date
          doctor_id
          relatives_full_name
          relationship
          timeslot_id
          user {
            first_name
            last_name
          }
          userByPhysicianId {
            first_name
            last_name
            profile_picture
            user_professional_backgrounds {
              specialty {
                speciality
                id
              }
            }
          }
        }
      }`;
  GET_UPCOMING_APPOINTMENTS_MEMBER_PORTAL = `query get_upcoming_appointments_member_portal($member_id: uuid="", $date: date!, $start_time: time) {
        appointments(where: {member_id: {_eq: $member_id}, _and: {appointment_date: {_eq: $date}, _and: {cancel: {_eq: false}, _and: {time: {_gte: $start_time}}}}}) {
          id
          time
          appointment_date
          doctor_id
          relatives_full_name
          relationship
          timeslot_id
          accepted
          user {
            first_name
            last_name
          }
          userByPhysicianId {
            first_name
            last_name
            profile_picture
            user_professional_backgrounds {
              specialty {
                speciality
                id
              }
            }
          }
        }
      }`;
}
export default new Queries();
