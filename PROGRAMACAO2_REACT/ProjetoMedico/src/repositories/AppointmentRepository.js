import Appointment from "../models/Appointment.js";

const getAllAppointments = async () => {
    return await Appointment.find().populate('doctorId').populate('pacientId');
}

const getAppointment = async (id) => {
    try {
        return await Appointment.findById(id).populate('doctorId').populate('pacientId');
    } catch (error) {
        throw new Error(error);
    }
}

const saveAppointment = async ({ date, doctorId, pacientId }) => {
    try {
        const appointment = new Appointment({ date, doctorId, pacientId });
        return await appointment.save();
    } catch (error) {
        throw new Error(error);
    }
}

const updateAppointment = async (id, { date, doctorId, pacientId }) => {
    try {
        return await Appointment.findByIdAndUpdate(id, { date, doctorId, pacientId }, { new: true });
    } catch (error) {
        throw new Error(error);
    }
}

const deleteAppointment = async (id) => {
    try {
        return await Appointment.findByIdAndDelete(id);
    } catch (error) {
        throw new Error(error);
    }
}

const appointmentRepository = {
    getAllAppointments,
    getAppointment,
    saveAppointment,
    updateAppointment,
    deleteAppointment
}

export default appointmentRepository;