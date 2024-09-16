import express from "express";
import appointmentService from "../services/AppointmentService.js";

let router = express.Router();

router.get('/Appointments', async (req, res) => {
    try { 
        const appointments = await appointmentService.getAllAppointments(); 
        res.send(appointments);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

router.get('/getAppointment/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const appointment = await appointmentService.getAppointment(id);
        res.send(appointment);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

router.post('/postAppointment', async (req, res) => {
    const { date, doctorId, pacientId } = req.body;
    try {
        const appointment = await appointmentService.saveAppointment({ date, doctorId, pacientId });
        res.send(appointment);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

router.put('/Appointments/:id', async (req, res) => {  
    const { id } = req.params;
    const { date, doctorId, pacientId } = req.body;
    try {
        const updatedAppointment = await appointmentService.updateAppointment(id, { date, doctorId, pacientId });
        res.send(updatedAppointment);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

router.delete('/Appointments/:id', async (req, res) => { 
    const { id } = req.params;
    try {
        const deletedAppointment = await appointmentService.deleteAppointment(id);
        res.send(deletedAppointment);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

router.put('/reschedule/:id', async (req, res) => {
    const { id } = req.params;
    const { date } = req.body;
    try {
        let appointment = await appointmentService.getAppointment(id);
        appointment.date = date;

        appointment = await appointmentService.updateAppointment(id, { date });
        res.send(appointment);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

export default router;
