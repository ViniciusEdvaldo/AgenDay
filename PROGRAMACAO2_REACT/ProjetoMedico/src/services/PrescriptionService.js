import PrescriptionRepository from "../repositories/PrescriptionRepository.js";
import appointmentService from "./AppointmentService.js";
import pacientService from "./PacientService.js";
import doctorService from "./DoctorService.js";
import fs from 'fs';
import PDFDocument from "pdfkit";
import path from 'path';

const __dirname = path.resolve();

const getAllPrescriptions = async () => {
    return await PrescriptionRepository.getAllPrescriptions();
};

const getPrescription = async (id) => {
    return await PrescriptionRepository.getPrescription(id);
};

const savePrescription = async ({ date, appointmentId, medicine, dosage, instructions }) => {
    return await PrescriptionRepository.savePrescription({ date, appointmentId, medicine, dosage, instructions });
};

const updatePrescription = async (id, { date, appointmentId, medicine, dosage, instructions, file }) => {
    return await PrescriptionRepository.updatePrescription(id, { date, appointmentId, medicine, dosage, instructions, file });
};

const deletePrescription = async (id) => {
    return await PrescriptionRepository.deletePrescription(id);
};

const generatePrescriptionFile = async (prescription) => {
    const appointment = await appointmentService.getAppointment(prescription.appointmentId);
    if (!appointment) throw new Error("Appointment not found");
    
    const pacient = await pacientService.getPacient(appointment.pacientId);
    if (!pacient) throw new Error("Pacient not found");

    const doctor = await doctorService.getDoctor(appointment.doctorId);
    if (!doctor) throw new Error("Doctor not found");

    const doc = new PDFDocument();
    const fileName = `Prescription_${prescription._id}.pdf`;
    const filePath = path.join(__dirname, "src/prescriptions", fileName);
    
    doc.pipe(fs.createWriteStream(filePath));
    
    doc.fontSize(12).text(`Medicine: ${prescription.medicine}`, { align: 'left' });
    doc.text(`Dosage: ${prescription.dosage}`, { align: 'left' });
    doc.text(`Instructions: ${prescription.instructions}`, { align: 'left' });
    doc.text(`Date: ${prescription.date}`, { align: 'left' });
    doc.text(`Appointment ID: ${prescription.appointmentId}`, { align: 'left' });
    doc.text(`Pacient: ${pacient.name}`, { align: 'left' });
    doc.text(`Doctor: ${doctor.name}`, { align: 'left' });
    
    doc.end();
    
    return fileName;
};

const PrescriptionService = {
    getAllPrescriptions,
    getPrescription,
    savePrescription,
    updatePrescription,
    deletePrescription,
    generatePrescriptionFile
};

export default PrescriptionService;
