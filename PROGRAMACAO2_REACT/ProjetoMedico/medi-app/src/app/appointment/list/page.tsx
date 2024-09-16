"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AppointmentList() {
    const [appointments, setAppointments] = useState<Array<any>>([]);
    const [doctors, setDoctors] = useState<Array<any>>([]);
    const [pacients, setPacients] = useState<Array<any>>([]);
    const [error, setError] = useState<string | null>(null);
    const [dataLoaded, setDataLoaded] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [appointmentsResponse, doctorsResponse, pacientsResponse] = await Promise.all([
                    fetch('http://127.0.0.1:3001/appointments', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }),
                    fetch('http://127.0.0.1:3001/doctors', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }),
                    fetch('http://127.0.0.1:3001/pacients', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                ]);

                const [appointmentsData, doctorsData, pacientsData] = await Promise.all([
                    appointmentsResponse.json(),
                    doctorsResponse.json(),
                    pacientsResponse.json()
                ]);

                setAppointments(appointmentsData);
                setDoctors(doctorsData);
                setPacients(pacientsData);
            } catch (err) {
                console.error("Erro ao carregar dados:", err);
                setError("Erro ao carregar dados.");
            } finally {
                setDataLoaded(true);
            }
        };

        fetchData();
    }, []);

    const deleteAppointment = async (id: string) => {
        try {
            const response = await fetch(`http://127.0.0.1:3001/appointments/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const content = await response.json();
            if (content.date) {
                setAppointments(appointments.filter((appointment) => appointment._id !== id));
            } else {
                setError(content.error);
            }
        } catch (err) {
            console.error("Erro ao deletar consulta:", err);
            setError("Erro ao deletar consulta.");
        }
    }

    const findDoctorName = (appointment: any) => {
        return appointment.doctorId && appointment.doctorId.name
            ? appointment.doctorId.name
            : "Desconhecido";
    };

    const findPacientName = (appointment: any) => {
        return appointment.pacientId && appointment.pacientId.name
            ? appointment.pacientId.name
            : "Desconhecido";
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Link className="font-medium text-blue-600 hover:underline" href="/home">Voltar</Link>
            <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Lista de Consultas</h2>

                {dataLoaded ? (
                    <div className="overflow-x-auto">
                        <table className='w-full border-collapse'>
                            <thead>
                                <tr>
                                    <th className='border-b border-blue-300 py-2 px-4 text-left text-blue-600'>Data</th>
                                    <th className='border-b border-blue-300 py-2 px-4 text-left text-blue-600'>Médico</th>
                                    <th className='border-b border-blue-300 py-2 px-4 text-left text-blue-600'>Paciente</th>
                                    <th className='border-b border-blue-300 py-2 px-4 text-left text-blue-600'>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.length > 0 ? (
                                    appointments.map((appointment) => (
                                        <tr key={appointment._id}>
                                            <td className='border-b border-blue-200 py-2 px-4'>{new Date(appointment.date).toLocaleDateString()}</td>
                                            <td className='border-b border-blue-200 py-2 px-4'>{findDoctorName(appointment)}</td>
                                            <td className='border-b border-blue-200 py-2 px-4'>{findPacientName(appointment)}</td>
                                            <td className='border-b border-blue-200 py-2 px-4 flex space-x-2'>
                                                <button 
                                                    onClick={() => deleteAppointment(appointment._id)} 
                                                    className='bg-red-500 hover:bg-red-600 text-white p-2 rounded-md text-sm'
                                                >
                                                    Excluir
                                                </button>
                                                <Link 
                                                    href={`/appointment/edit/${appointment._id}`} 
                                                    className='bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-md text-sm'
                                                >
                                                    Editar
                                                </Link>
                                                <Link 
                                                    href={`/prescription/${appointment._id}/create`} 
                                                    className='bg-green-500 hover:bg-green-600 text-white p-2 rounded-md text-sm'
                                                >
                                                    Nova Receita
                                                </Link>
                                                <Link 
                                                    href="/prescription/upload" 
                                                    className='bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md text-sm'
                                                >
                                                    Upload Receita
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className='py-4 text-center text-gray-500'>
                                            Nenhuma consulta encontrada.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center text-blue-600">Carregando...</div>
                )}

                {error && (
                    <div className="p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg mt-4">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}
