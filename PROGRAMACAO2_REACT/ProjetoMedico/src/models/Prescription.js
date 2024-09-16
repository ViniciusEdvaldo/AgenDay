import mongoose from "mongoose";

const Schema = mongoose.Schema;

const prescriptionSchema = new Schema({
    date: {
        type: Date,
    },
    appointmentId: {
        type: Schema.Types.ObjectId,
        ref: 'Appointment',
        required: [true, 'ID of appointment is required']
    },
    medicine: {
        type: String,
        required: [true, 'Medicine is required']
    },
    dosage: {
        type: String,
        required: [true, 'Dosage is required']
    },
    instructions: {
        type: String,
    },
    createdAT: {
        type: Date,
        default: Date.now
    },
    file: {
        type: String,
    }
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);
export default Prescription;
