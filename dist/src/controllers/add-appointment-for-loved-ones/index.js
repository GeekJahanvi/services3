"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
const queries_1 = __importDefault(require("../../graphql/appointments/queries"));
const mutations_1 = __importDefault(require("../../graphql/appointments/mutations"));
const commons_1 = __importDefault(require("../../commons"));
function resolveAppointmentsForLovedOnes({ timeslot_id }) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield commons_1.default.createAction({
            timeslot_id: timeslot_id
        }, queries_1.default.CHECK_TIMESLOT, 'timeslots');
        return { appointmentData: data, appointmentErrors: error };
    });
}
function createAppointmentForLovedOnes(member_id, doctor_id, appointment_date, appointment_for, details, duration, relationship, relatives_dob, relatives_full_name, time, agenda, timeslot_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield commons_1.default.createAction({
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
        }, mutations_1.default.ADD_APPOINTMENT_FOR_LOVED_ONES, 'insert_appointments');
        return { appointment: data, errors: error };
    });
}
const AddAppointmentsForLovedOnes = {
    handle(req, res) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { member_id, doctor_id, appointment_date, appointment_for, details, duration, relationship, relatives_dob, relatives_full_name, time, agenda, timeslot_id } = ((_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.input) === null || _b === void 0 ? void 0 : _b.input) || ((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.input) || (req === null || req === void 0 ? void 0 : req.body);
                if (timeslot_id == '') {
                    return res.status(400).json({ status: false, message: 'Enter timeslot_id' });
                }
                const { appointmentData, appointmentErrors } = yield resolveAppointmentsForLovedOnes({ timeslot_id });
                if (appointmentErrors) {
                    return res.status(200).json({ status: false, message: appointmentErrors });
                }
                if (appointmentData[0].booked) {
                    return res.status(200).json({ status: false, message: `Timeslot already booked` });
                }
                const { appointment, errors } = yield createAppointmentForLovedOnes(member_id, doctor_id, appointment_date, appointment_for, details, duration, relationship, relatives_dob, relatives_full_name, time, agenda, timeslot_id);
                if (errors) {
                    return res.status(200).json({ status: false, message: errors });
                }
                return res.status(200).json({
                    status: true,
                    message: `${appointment.returning[0].appointment_date} appointment is added`,
                    data: appointment.returning[0]
                });
            }
            catch (e) {
                return res.status(200).json({ status: false, message: 'Something has changed.' });
            }
        });
    }
};
module.exports = AddAppointmentsForLovedOnes.handle;
//# sourceMappingURL=index.js.map