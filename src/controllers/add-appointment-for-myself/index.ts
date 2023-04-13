/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import Queries from '../../graphql/appointments/queries';
import Mutations from '../../graphql/appointments/mutations';
import Common from '../../commons';
import { Request, Response } from 'express';

async function resolveAppointmentsForMyself(timeslot_id: string): Promise<{ appointmentData: any; appointmentErrors: any }> {

  const { data, error } = await Common.createAction(
    {
      timeslot_id: timeslot_id
    },
    Queries.CHECK_TIMESLOT,
    'timeslots',
  );

  return { appointmentData: data, appointmentErrors: error };
}

async function createAppointmentForMyself(
  member_id: string,
  doctor_id: string,
  appointment_date: string,
  appointment_for: string,
  details: string,
  duration: string,
  time: string,
  agenda: string,
  timeslot_id: string
): Promise<{ appointment: any; errors: any }> {
  const { data, error } = await Common.createAction(
    {
      member_id: member_id,
      doctor_id: doctor_id,
      appointment_date: appointment_date,
      appointment_for: appointment_for,
      details: details,
      duration: duration,
      time: time,
      agenda: agenda,
      timeslot_id: timeslot_id
    },
    Mutations.ADD_APPOINTMENT_FOR_MYSELF,
    'insert_appointments'
  );

  return { appointment: data, errors: error };
}

const AddAppointmentsForMyself = {
  async handle(req: Request, res: Response) {
    try {
      const {
        member_id,
        doctor_id,
        appointment_date,
        appointment_for,
        details,
        duration,
        time,
        agenda,
        timeslot_id
      } = req.body?.input?.input || req?.body?.input || req?.body;

      const { appointmentData, appointmentErrors } = await resolveAppointmentsForMyself(
        timeslot_id
      );
      if (appointmentErrors) {
        return res.status(200).json({ status: false, message: appointmentErrors });
      }

      if (appointmentData[0].booked) {
        return res.status(200).json({ status: false, message: `Timeslot already booked` });
      }

      const { appointment, errors } = await createAppointmentForMyself(
        member_id,
        doctor_id,
        appointment_date,
        appointment_for,
        details,
        duration,
        time,
        agenda,
        timeslot_id
      );

      if (errors) {
        return res.status(200).json({ status: false, message: errors });
      }
      
      return res.status(200).json({
        status: true,
        message: `Appointment for ${appointment.returning[0].appointment_date}  is added`,
        data: appointment.returning[0]
      });
    } catch (e) {
      return res.status(200).json({ status: false, message: 'Something has changed.' });
    }
  }
};

module.exports = AddAppointmentsForMyself.handle;