import mongoose from "mongoose";

const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    date: {
        type: Date,
        required: [true, 'Appointment Date is required']
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    pacientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pacient'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;