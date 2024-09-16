"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PrescriptionManage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [prescriptions, setPrescriptions] = useState<any[]>([]);
    const [editing, setEditing] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [newPrescriptionForm, setNewPrescriptionForm] = useState({
        date: '',
        medicine: '',
        dosage: '',
        instructions: '',
        appointmentId: ''
    });
    const [editForm, setEditForm] = useState({
        medicine: '',
        dosage: '',
        instructions: ''
    });
    const [maintenanceMessage, setMaintenanceMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const response = await fetch('http://127.0.0.1:3001/prescriptions', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': sessionStorage.getItem("token") || ''
                    }
                });

                if (!response.ok) throw new Error('Failed to fetch prescriptions.');

                const data = await response.json();
                setPrescriptions(data);
            } catch (error) {
                setError('Error fetching prescriptions.');
            }
        };

        fetchPrescriptions();
    }, []);

    const deletePrescription = async (id: string) => {
        try {
            const response = await fetch(`http://127.0.0.1:3001/prescriptions/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': sessionStorage.getItem("token") || ''
                }
            });

            if (!response.ok) throw new Error('Failed to delete prescription.');

            setPrescriptions(prescriptions.filter(prescription => prescription._id !== id));
        } catch (error) {
            setError('Error deleting prescription.');
        }
    };

    const editPrescription = async (id: string) => {
        try {
            const response = await fetch(`http://127.0.0.1:3001/prescriptions/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.getItem("token") || ''
                },
                body: JSON.stringify(editForm)
            });

            if (!response.ok) throw new Error('Failed to update prescription.');

            const updatedPrescription = await response.json();
            setPrescriptions(prescriptions.map(prescription => prescription._id === id ? updatedPrescription : prescription));
            setEditing(null);
        } catch (error) {
            setError('Error updating prescription.');
        }
    };

    const createPrescription = async () => {
        try {
            const response = await fetch('http://127.0.0.1:3001/prescriptions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.getItem("token") || ''
                },
                body: JSON.stringify(newPrescriptionForm)
            });

            if (!response.ok) throw new Error('Failed to create prescription.');

            const newPrescription = await response.json();
            setPrescriptions([...prescriptions, newPrescription]);
            setIsCreating(false);
        } catch (error) {
            setError('Error creating prescription.');
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <Link className="text-blue-600 hover:underline text-lg mb-4 inline-block" href="/home">Voltar</Link>
            <div className="container mx-auto bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold text-blue-600 mb-6">Gerenciar Prescrições</h2>

                {error && (
                    <div className="p-4 mb-4 bg-red-100 text-red-700 border border-red-300 rounded-lg">
                        {error}
                    </div>
                )}

                {maintenanceMessage && (
                    <div className="p-4 mb-4 bg-blue-100 text-blue-700 border border-blue-300 rounded-lg">
                        {maintenanceMessage}
                    </div>
                )}

                <button 
                    onClick={() => setIsCreating(true)} 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
                >
                    Nova Receita
                </button>

                {isCreating && (
                    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Criar Nova Prescrição</h3>
                        <div className="mb-4">
                            <label className="block text-gray-700">Data:</label>
                            <input 
                                type="date" 
                                value={newPrescriptionForm.date} 
                                onChange={(e) => setNewPrescriptionForm({ ...newPrescriptionForm, date: e.target.value })} 
                                className="border p-2 w-full rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Medicamento:</label>
                            <input 
                                type="text" 
                                value={newPrescriptionForm.medicine} 
                                onChange={(e) => setNewPrescriptionForm({ ...newPrescriptionForm, medicine: e.target.value })} 
                                className="border p-2 w-full rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Dosagem:</label>
                            <input 
                                type="text" 
                                value={newPrescriptionForm.dosage} 
                                onChange={(e) => setNewPrescriptionForm({ ...newPrescriptionForm, dosage: e.target.value })} 
                                className="border p-2 w-full rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Instruções:</label>
                            <input 
                                type="text" 
                                value={newPrescriptionForm.instructions} 
                                onChange={(e) => setNewPrescriptionForm({ ...newPrescriptionForm, instructions: e.target.value })} 
                                className="border p-2 w-full rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">ID da Consulta:</label>
                            <input 
                                type="text" 
                                value={newPrescriptionForm.appointmentId} 
                                onChange={(e) => setNewPrescriptionForm({ ...newPrescriptionForm, appointmentId: e.target.value })} 
                                className="border p-2 w-full rounded"
                            />
                        </div>
                        <button 
                            onClick={createPrescription} 
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Criar
                        </button>
                    </div>
                )}

                <table className="w-full border-separate border-spacing-0 border border-gray-200">
                    <thead>
                        <tr>
                            <th className="border-b border-gray-300 py-2 px-4 text-left text-blue-600">Data</th>
                            <th className="border-b border-gray-300 py-2 px-4 text-left text-blue-600">Medicamento</th>
                            <th className="border-b border-gray-300 py-2 px-4 text-left text-blue-600">Dosagem</th>
                            <th className="border-b border-gray-300 py-2 px-4 text-left text-blue-600">Instruções</th>
                            <th className="border-b border-gray-300 py-2 px-4 text-left text-blue-600">Visualizar</th>
                            <th className="border-b border-gray-300 py-2 px-4 text-left text-blue-600">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prescriptions.map((prescription) => (
                            <tr key={prescription._id} className="hover:bg-gray-100">
                                <td className="border-b border-gray-200 py-2 px-4">{prescription.date}</td>
                                <td className="border-b border-gray-200 py-2 px-4">{prescription.medicine}</td>
                                <td className="border-b border-gray-200 py-2 px-4">{prescription.dosage}</td>
                                <td className="border-b border-gray-200 py-2 px-4">{prescription.instructions}</td>
                                <td className="border-b border-gray-200 py-2 px-4">
                                    <a 
                                        href="#" 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setMaintenanceMessage('A funcionalidade de visualização de PDFs está em manutenção. Espero sua compreensão :)');
                                        }} 
                                        className="text-blue-500 hover:underline"
                                    >
                                        Visualizar
                                    </a>
                                </td>
                                <td className="border-b border-gray-200 py-2 px-4">
                                    <button 
                                        onClick={() => {
                                            setEditing(prescription._id);
                                            setEditForm({
                                                medicine: prescription.medicine,
                                                dosage: prescription.dosage,
                                                instructions: prescription.instructions
                                            });
                                        }} 
                                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mr-2"
                                    >
                                        Editar
                                    </button>
                                    <button 
                                        onClick={() => deletePrescription(prescription._id)} 
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
