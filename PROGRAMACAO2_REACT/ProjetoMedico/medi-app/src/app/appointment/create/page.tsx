"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

interface Doctor {
    _id: string;
    name: string;
}

interface Pacient {
    _id: string;
    name: string;
}

export default function AppointmentCreate() {
    const router = useRouter();
    const [date, setDate] = useState<string>('');
    const [doctorId, setDoctorId] = useState<string>('');
    const [pacientId, setPacientId] = useState<string>('');
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [pacients, setPacients] = useState<Pacient[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await fetch('http://127.0.0.1:3001/doctors', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': sessionStorage.getItem("token") || ''
                    },
                });
                if (!response.ok) throw new Error("Erro ao carregar médicos.");
                const data: Doctor[] = await response.json();
                setDoctors(data);
            } catch (err) {
                setError("Erro ao carregar a lista de médicos.");
            }
        };

        const fetchPacients = async () => {
            try {
                const response = await fetch('http://127.0.0.1:3001/pacients', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': sessionStorage.getItem("token") || ''
                    },
                });
                if (!response.ok) throw new Error("Erro ao carregar pacientes.");
                const data: Pacient[] = await response.json();
                setPacients(data);
            } catch (err) {
                setError("Erro ao carregar a lista de pacientes.");
            }
        };

        fetchDoctors();
        fetchPacients();
    }, []);

    const addAppointment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (!date || !doctorId || !pacientId) {
            setError("Todos os campos são obrigatórios.");
            return;
        }

        const formData = { date, doctorId, pacientId };

        try {
            const response = await fetch('http://127.0.0.1:3001/postAppointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.getItem("token") || ''
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) throw new Error("Erro ao criar consulta.");
            const content = await response.json();
            if (content.date) {
                router.push('/home');
            } else {
                setError(content.error || "Erro ao criar consulta.");
            }
        } catch (err) {
            setError("Erro ao enviar dados. Tente novamente.");
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Link className="font-medium text-blue-600 hover:underline" href="/home">Voltar</Link>
            <form className='w-full max-w-md mx-auto bg-white p-6 shadow-lg rounded-lg' onSubmit={addAppointment}>
                <h2 className='font-bold text-blue-600 py-2 block text-2xl'>Criar Nova Consulta</h2>
                <div className='mb-4'>
                    <label htmlFor="date" className='block text-sm font-bold text-gray-700'>Data e Hora</label>
                    <input
                        type="datetime-local"
                        id="date"
                        value={date}
                        className='w-full border border-gray-300 p-2 rounded-md'
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <div className='mb-4'>
                    <label htmlFor="doctorId" className='block text-sm font-bold text-gray-700'>Médico</label>
                    <select
                        id="doctorId"
                        value={doctorId}
                        className='w-full border border-gray-300 p-2 rounded-md'
                        onChange={(e) => setDoctorId(e.target.value)}
                    >
                        <option value="">Selecione um médico</option>
                        {doctors.length > 0 ? (
                            doctors.map((doctor) => (
                                <option key={doctor._id} value={doctor._id}>
                                    {doctor.name}
                                </option>
                            ))
                        ) : (
                            <option>Carregando médicos...</option>
                        )}
                    </select>
                </div>
                <div className='mb-4'>
                    <label htmlFor="pacientId" className='block text-sm font-bold text-gray-700'>Paciente</label>
                    <select
                        id="pacientId"
                        value={pacientId}
                        className='w-full border border-gray-300 p-2 rounded-md'
                        onChange={(e) => setPacientId(e.target.value)}
                    >
                        <option value="">Selecione um paciente</option>
                        {pacients.length > 0 ? (
                            pacients.map((pacient) => (
                                <option key={pacient._id} value={pacient._id}>
                                    {pacient.name}
                                </option>
                            ))
                        ) : (
                            <option>Carregando pacientes...</option>
                        )}
                    </select>
                </div>
                <button type="submit" className="w-full py-2 px-4 text-white bg-green-500 border border-gray-200 rounded-md hover:bg-green-600">
                    Criar Consulta
                </button>
                {error && (
                    <div className="p-2 text-white bg-red-500 border border-red-300 rounded-md mt-4">
                        {error}
                    </div>
                )}
            </form>
        </div>
    );
}
