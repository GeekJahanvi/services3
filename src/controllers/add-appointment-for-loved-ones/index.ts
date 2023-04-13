/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import Queries from '../../graphql/appointments/queries';
import Mutations from '../../graphql/appointments/mutations';
import Common from '../../commons';
import { Request, Response } from 'express';

interface ResolveAppointmentsForLovedOnesInput {
    timeslot_id: string;
}

async function resolveAppointmentsForLovedOnes({
    timeslot_id
}: ResolveAppointmentsForLovedOnesInput): Promise<{ appointmentData: any; appointmentErrors: any }> {

    const { data, error } = await Common.createAction(
        {
            timeslot_id: timeslot_id
        },
        Queries.CHECK_TIMESLOT,
        'timeslots',
    );

    return { appointmentData: data, appointmentErrors: error };
}

async function createAppointmentForLovedOnes(
    member_id: any,
    doctor_id: any,
    appointment_date: any,
    appointment_for: any,
    details: any,
    duration: any,
    relationship: any,
    relatives_dob: any,
    relatives_full_name: any,
    time: any,
    agenda: any,
    timeslot_id: any
) {
    const { data, error } = await Common.createAction(
        {
            member_id: member_id,
            doctor_id: doctor_id,
            appointment_date: appointment_date,
            appointment_for: appointment_for,
            details: details,
            duration: duration,
            relationship: relationship,
            relatives_dob: relatives_dob,
            relatives_full_name: relatives_full_name,
            time: time,
            agenda: agenda,
            timeslot_id: timeslot_id
        },
        Mutations.ADD_APPOINTMENT_FOR_LOVED_ONES,
        'insert_appointments'
    );
    return { appointment: data, errors: error };
}

const AddAppointmentsForLovedOnes = {
    async handle(req: Request, res: Response) {
        try {
            const {
                member_id,
                doctor_id,
                appointment_date,
                appointment_for,
                details,
                duration,
                relationship,
                relatives_dob,
                relatives_full_name,
                time,
                agenda,
                timeslot_id
            } = req.body?.input?.input || req?.body?.input || req?.body;

            if (timeslot_id == '') {
                return res.status(400).json({ status: false, message: 'Enter timeslot_id' })
            }
            const { appointmentData, appointmentErrors } = await resolveAppointmentsForLovedOnes(
                { timeslot_id }
            );
            if (appointmentErrors) {
                return res.status(200).json({ status: false, message: appointmentErrors });
            }

            if (appointmentData[0].booked) {
                return res.status(200).json({ status: false, message: `Timeslot already booked` });
            }

            const { appointment, errors } = await createAppointmentForLovedOnes(
                member_id,
                doctor_id,
                appointment_date,
                appointment_for,
                details,
                duration,
                relationship,
                relatives_dob,
                relatives_full_name,
                time,
                agenda,
                timeslot_id
            );

            if (errors) {
                return res.status(200).json({ status: false, message: errors });
            }

            return res.status(200).json({
                status: true,
                message: `${appointment.returning[0].appointment_date} appointment is added`,
                data: appointment.returning[0]
            });
        } catch (e) {
            return res.status(200).json({ status: false, message: 'Something has changed.' });
        }
    }
};

module.exports = AddAppointmentsForLovedOnes.handle;