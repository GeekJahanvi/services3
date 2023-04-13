class Mutations {
  ADD_APPOINTMENT_FOR_LOVED_ONES = `mutation add_appointment_for_loved_one($member_id: uuid!, $doctor_id: uuid!, $appointment_date: date!, $appointment_for: String!, $details: String!, $duration: String!, $relationship: String!, $relatives_dob: date!, $relatives_full_name: String!, $time: time!, $agenda: String!, $timeslot_id: uuid!) {
        insert_appointments(objects: {member_id: $member_id,doctor_id: $doctor_id, appointment_date: $appointment_date, appointment_for: $appointment_for, details: $details, duration: $duration, relationship: $relationship, relatives_dob: $relatives_dob, relatives_full_name: $relatives_full_name, time: $time, agenda: $agenda, timeslot_id: $timeslot_id}) {
          returning {
            agenda
            appointment_date
            id
            appointment_for
            details
            duration
            member_id
            doctor_id
            relationship
            relatives_dob
            relatives_full_name
            time
            timeslot_id
          }
        }
        update_timeslots(where: {id: {_eq: $timeslot_id}}, _set: {booked: true}) {
          returning {
            booked
            duration
            start_time
            end_time
          }
        }
    }`;

  ADD_APPOINTMENT_FOR_MYSELF = `mutation add_appointment_for_myself($member_id: uuid!, $doctor_id: uuid!, $appointment_date: date!, $appointment_for: String!, $details: String!, $duration: String!, $time: time!, $agenda: String!, $timeslot_id: uuid!) {
      insert_appointments(objects: {member_id: $member_id, doctor_id: $doctor_id, appointment_date: $appointment_date, appointment_for: $appointment_for, details: $details, duration: $duration, time: $time, agenda: $agenda, timeslot_id: $timeslot_id}) {
        returning {
          agenda
          appointment_date
          id
          appointment_for
          details
          duration
          member_id
          doctor_id
          time
          timeslot_id
        }
      }
      update_timeslots(where: {id: {_eq: $timeslot_id}}, _set: {booked: true}) {
        returning {
          booked
          duration
          start_time
          end_time
        }
      }
    }`;
}
export default new Mutations();
