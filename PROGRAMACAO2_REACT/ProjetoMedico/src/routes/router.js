import express from "express";
import appointmentController from "./AppointmentController.js";
import doctorController from "./DoctorController.js";
import pacientController from "./PacientController.js";
import prescriptionController from "./PrescriptionController.js";
import doctorService from "../services/DoctorService.js";
import bcrypt from 'bcrypt';

let router = express.Router();

// Rota para teste
router.get("/", function (req, res) {
    console.log("eae");
    res.status(200).json({ message: "eae" });
});

// Mapeamento do login sem uso de token
router.post('/login', async (req, res) => {
    try {
        const { login, password } = req.body;
        const doctor = await doctorService.getDoctorByLogin(login);
        if (!doctor) {
            return res.status(401).json({ error: 'Authentication failed!' });
        }

        const passwordMatch = await bcrypt.compare(password, doctor.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed!' });
        }

        // Em vez de gerar um token, apenas retorna uma mensagem de sucesso
        res.status(200).json({ message: "Login bem-sucedido!" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Login failed!' });
    }
});

// As rotas agora são acessíveis sem autenticação de token
router.use("/", appointmentController);
router.use("/", doctorController);
router.use("/", pacientController);
router.use("/", prescriptionController);

export default router;
