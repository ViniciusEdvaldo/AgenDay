import express from 'express';
import PrescriptionService from '../services/PrescriptionService.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Criação das variáveis __filename e __dirname usando import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname, '../../src/prescriptions'));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/uploadPrescription/:id', upload.single('file'), async (req, res) => {
    try {
        const { id } = req.params;
        const prescription = await PrescriptionService.getPrescription(id);

        if (!prescription) {
            return res.status(404).json({ message: 'Prescrição não encontrada.' });
        }

        const filePath = path.join('prescriptions', req.file.originalname);
        const updatedPrescription = await PrescriptionService.updatePrescription(id, { file: filePath });

        return res.status(200).send(updatedPrescription);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

router.get('/readPrescription/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const prescription = await PrescriptionService.getPrescription(id);

        if (!prescription || !prescription.file) {
            return res.status(404).json({ message: 'Prescrição ou arquivo não encontrado.' });
        }

        const filePath = path.resolve(__dirname, '../../src/prescriptions', path.basename(prescription.file));

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'Arquivo não encontrado.' });
        }

        res.status(200).sendFile(filePath);
    } catch (error) {
        console.error('Erro ao ler prescrição:', error);
        res.status(500).json({ message: 'Erro interno ao tentar ler o arquivo de prescrição.' });
    }
});

router.get('/prescriptions', async (req, res) => {
    try {
        const prescriptions = await PrescriptionService.getAllPrescriptions();
        res.send(prescriptions);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

router.get('/getPrescription/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const prescription = await PrescriptionService.getPrescription(id);
        res.send(prescription);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

router.post('/postPrescription', async (req, res) => {
    const { date, appointmentId, medicine, dosage, instructions } = req.body;
    try {
        const prescription = await PrescriptionService.savePrescription({ date, appointmentId, medicine, dosage, instructions });
        res.send(prescription);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

router.put('/prescriptions/:id', async (req, res) => {
    const { id } = req.params;
    const { date, appointmentId, medicine, dosage, instructions } = req.body;

    try {
        const prescription = await PrescriptionService.updatePrescription(id, { date, appointmentId, medicine, dosage, instructions });
        res.send(prescription);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

router.delete('/prescriptions/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const prescription = await PrescriptionService.deletePrescription(id);
        res.send(prescription);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

router.get('/generatePrescription/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const prescription = await PrescriptionService.getPrescription(id);
        const fileName = await PrescriptionService.generatePrescriptionFile(prescription);

        const filePath = path.join('prescriptions', fileName);
        prescription.file = filePath;
        await PrescriptionService.updatePrescription(id, prescription);

        res.sendFile(path.resolve(__dirname, '../../src/prescriptions', fileName));
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

export default router;
