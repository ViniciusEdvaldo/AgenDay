"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function AppointmentEdit(params: any) {
    const router = useRouter();

    const [date, setDate] = useState<string>('');
    const [doctorId, setDoctorId] = useState<string>();
    const [pacientId, setPacientId] = useState<string>('');
    const [appointment, setAppointment] = useState({ date, doctorId, pacientId });
    const [doctors, setDoctors] = useState<Array<any>>([]);
    const [pacients, setPacients] = useState<Array<any>>([]);
    const [error, setError] = useState<string | null>(null);

    const id = params.params.id;

    useEffect(() => {
        fetch('http://127.0.0.1:3001/getAppointment/' + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem("token") || ''
            },
        })
        .then(response => response.json())
        .then(data => {
            setAppointment(data);
        });
    }, [id]);

    useEffect(() => {
        fetch('http://127.0.0.1:3001/doctors', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem("token") || ''
            },
        })
        .then(response => response.json())
        .then(data => {
            setDoctors(data);
        });
    }, []);

    useEffect(() => {
        fetch('http://127.0.0.1:3001/pacients', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem("token") || ''
            },
        })
        .then(response => response.json())
        .then(data => {
            setPacients(data);
        });
    }, []);

    const edit = async (e: any) => {
        e.preventDefault();
        setError(null);

        const formData = {
            date: date || appointment.date,
            doctorId: doctorId || appointment.doctorId,
            pacientId: pacientId || appointment.pacientId,
        };

        const add = await fetch('http://127.0.0.1:3001/appointments/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem("token") || ''
            },
            body: JSON.stringify(formData)
        });

        const content = await add.json();

        if (content.date) {
            router.push('/home');
        } else {
            setError(content.error);
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
            <Link href="/appointment/list" className="text-blue-600 hover:underline mb-4">
                Voltar
            </Link>

            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-bold text-blue-500 mb-4">Editar Consulta</h2>

                <form onSubmit={edit} className="space-y-4">
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Data</label>
                        <input 
                            type="text" 
                            id="date"
                            defaultValue={appointment.date} 
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            onChange={(e: any) => setDate(e.target.value)} 
                        />
                    </div>

                    <div>
                        <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700">Médico</label>
                        <select 
                            id="doctorId" 
                            onChange={(e: any) => setDoctorId(e.target.value)}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {doctors.map((doctor, i) => (
                                <option key={i} value={doctor._id} selected={appointment.doctorId === doctor._id}>
                                    {doctor.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="pacientId" className="block text-sm font-medium text-gray-700">Paciente</label>
                        <select 
                            id="pacientId" 
                            onChange={(e: any) => setPacientId(e.target.value)}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {pacients.map((pacient, i) => (
                                <option key={i} value={pacient._id} selected={appointment.pacientId === pacient._id}>
                                    {pacient.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full py-3 font-semibold text-white bg-green-500 rounded-lg shadow-sm hover:bg-green-600 transition-colors duration-300"
                    >
                        Atualizar
                    </button>

                    {error && (
                        <div className="p-2 text-white bg-red-500 border border-red-600 rounded-lg">
                            {error}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
