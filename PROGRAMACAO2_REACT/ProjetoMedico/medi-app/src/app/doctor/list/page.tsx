"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Doctor {
    _id: string;
    name: string;
    login: string;
    medicalSpecialty: string;
    medicalRegistration: string;
    email: string;
    phone: string;
}

export default function DoctorList() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchDoctors = async () => {
        setLoading(true);
        setError(null); // Limpa qualquer erro anterior
        try {
            const response = await fetch('http://127.0.0.1:3001/doctors', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.getItem("token") || ''
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            setDoctors(data);
        } catch (err: any) {
            setError(`Failed to fetch doctors: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const deleteDoctor = async (id: string) => {
        try {
            const response = await fetch(`http://127.0.0.1:3001/doctors/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.getItem("token") || ''
                },
            });

            if (!response.ok) {
                const content = await response.json();
                throw new Error(content.error || 'Failed to delete doctor.');
            }

            // Recarregar a lista de médicos
            fetchDoctors();
        } catch (err: any) {
            setError(`Failed to delete doctor: ${err.message}`);
        }
    }

    useEffect(() => {
        fetchDoctors();
    }, []);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Link className="font-medium text-blue-600 hover:underline" href="/home">Voltar</Link>
            <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Lista de Médicos</h2>
                
                {loading && (
                    <div className="text-center text-blue-600">Carregando...</div>
                )}

                <table className='w-full border-collapse'>
                    <thead>
                        <tr>
                            <th className='border-b border-blue-300 py-2 px-4 text-left text-blue-600'>Nome</th>
                            <th className='border-b border-blue-300 py-2 px-4 text-left text-blue-600'>Login</th>
                            <th className='border-b border-blue-300 py-2 px-4 text-left text-blue-600'>Especialidade Médica</th>
                            <th className='border-b border-blue-300 py-2 px-4 text-left text-blue-600'>Registro Médico</th>
                            <th className='border-b border-blue-300 py-2 px-4 text-left text-blue-600'>Email</th>
                            <th className='border-b border-blue-300 py-2 px-4 text-left text-blue-600'>Telefone</th>
                            <th className='border-b border-blue-300 py-2 px-4 text-left text-blue-600'>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doctors.map((doctor) => (
                            <tr key={doctor._id}>
                                <td className='border-b border-blue-200 py-2 px-4'>{doctor.name}</td>
                                <td className='border-b border-blue-200 py-2 px-4'>{doctor.login}</td>
                                <td className='border-b border-blue-200 py-2 px-4'>{doctor.medicalSpecialty}</td>
                                <td className='border-b border-blue-200 py-2 px-4'>{doctor.medicalRegistration}</td>
                                <td className='border-b border-blue-200 py-2 px-4'>{doctor.email}</td>
                                <td className='border-b border-blue-200 py-2 px-4'>{doctor.phone}</td>
                                <td className='border-b border-blue-200 py-2 px-4 flex space-x-2'>
                                    <button 
                                        onClick={() => deleteDoctor(doctor._id)} 
                                        className='bg-red-500 hover:bg-red-600 text-white p-2 rounded-md text-sm'
                                    >
                                        Deletar
                                    </button>
                                    <Link 
                                        href={`/doctor/edit/${doctor._id}`} 
                                        className='bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-md text-sm'
                                    >
                                        Editar
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {error && (
                    <div className="p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg mt-4">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}
