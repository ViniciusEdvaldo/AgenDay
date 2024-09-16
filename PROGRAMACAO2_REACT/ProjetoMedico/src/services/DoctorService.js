import Doctor from '../models/Doctor.js';

const getAllDoctors = async () => {
    try {
        return await Doctor.find({});
    } catch (error) {
        throw new Error(error);
    }
};

const getDoctor = async (id) => {
    try {
        return await Doctor.findById(id); 
    } catch (error) {
        throw new Error(error);
    }
};

const saveDoctor = async (doctorData) => {
    try {
        const doctor = new Doctor(doctorData);
        return await doctor.save();
    } catch (error) {
        throw new Error(error);
    }
};

const updateDoctor = async (id, updatedData) => {
    try {
        return await Doctor.findByIdAndUpdate(id, updatedData, { new: true });
    } catch (error) {
        throw new Error(error);
    }
};

const deleteDoctor = async (id) => {
    try {
        return await Doctor.findByIdAndDelete(id);
    } catch (error) {
        throw new Error(error);
    }
};

export default {
    getAllDoctors,
    getDoctor,
    saveDoctor,
    updateDoctor,
    deleteDoctor
};
