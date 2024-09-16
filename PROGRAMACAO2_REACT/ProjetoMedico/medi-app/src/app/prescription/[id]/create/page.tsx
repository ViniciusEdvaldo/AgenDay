"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function PrescriptionCreate(params: any) {
    const router = useRouter();

    const [date, setDate] = useState<string>('');
    const [medicine, setMedicine] = useState<string>('');
    const [dosage, setDosage] = useState<string>('');
    const [instructions, setInstructions] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const appointmentId = params.params.id;

    const addPrescription = async (e: any) => {
        e.preventDefault();
        setError(null);

        if (date && medicine && dosage) {
            const formData = {
                date,
                appointmentId,
                medicine,
                dosage,
                instructions
            };

            try {
                const response = await fetch('http://127.0.0.1:3001/postPrescription', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': sessionStorage.getItem("token") || ''
                    },
                    body: JSON.stringify(formData)
                });

                const content = await response.json();

                if (content.date) {
                    router.push('/home');
                } else {
                    setError(content.error);
                }
            } catch (err) {
                setError('Erro ao criar prescrição. Tente novamente.');
            }
        } else {
            setError('Preencha todos os campos obrigatórios.');
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
            <Link href="/appointment/list" className="text-blue-600 hover:underline mb-6">
                Voltar
            </Link>

            <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-2xl font-bold text-blue-600 mb-6">Criar Prescrição</h2>

                <form onSubmit={addPrescription} className="space-y-4">
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Data da Prescrição</label>
                        <input 
                            type="date" 
                            id="date" 
                            value={date} 
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            onChange={(e: any) => setDate(e.target.value)} 
                        />
                    </div>

                    <div>
                        <label htmlFor="medicine" className="block text-sm font-medium text-gray-700">Medicamento</label>
                        <textarea 
                            id="medicine" 
                            value={medicine} 
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            onChange={(e: any) => setMedicine(e.target.value)} 
                        />
                    </div>

                    <div>
                        <label htmlFor="dosage" className="block text-sm font-medium text-gray-700">Dosagem</label>
                        <textarea 
                            id="dosage" 
                            value={dosage} 
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            onChange={(e: any) => setDosage(e.target.value)} 
                        />
                    </div>

                    <div>
                        <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">Instruções de Uso</label>
                        <textarea 
                            id="instructions" 
                            value={instructions} 
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            onChange={(e: any) => setInstructions(e.target.value)} 
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full py-3 text-white bg-green-500 rounded-lg shadow-sm hover:bg-green-600 transition-colors duration-300"
                    >
                        Criar Prescrição
                    </button>

                    {error && (
                        <div className="p-3 text-white bg-red-500 border border-red-600 rounded-lg">
                            {error}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
