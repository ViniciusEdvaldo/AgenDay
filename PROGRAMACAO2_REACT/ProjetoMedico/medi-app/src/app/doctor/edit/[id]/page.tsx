"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface DoctorEditProps {
    params: { id: string };
}

export default function DoctorEdit({ params }: DoctorEditProps) {
    const router = useRouter();

    const [name, setName] = useState<string>('');
    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [medicalSpecialty, setMedicalSpecialty] = useState<string>('');
    const [medicalRegistration, setMedicalRegistration] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    
    const id = params.id;

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:3001/getDoctor/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': sessionStorage.getItem("token") || ''
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setName(data.name);
                setLogin(data.login);
                setPassword(data.password);
                setMedicalSpecialty(data.medicalSpecialty);
                setMedicalRegistration(data.medicalRegistration);
                setEmail(data.email);
                setPhone(data.phone);
            } catch (err) {
                setError('Failed to fetch doctor details.');
            }
        };

        fetchDoctor();
    }, [id]);

    const edit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const formData = {
            name: name || undefined,
            login: login || undefined,
            password: password || undefined,
            medicalSpecialty: medicalSpecialty || undefined,
            medicalRegistration: medicalRegistration || undefined,
            email: email || undefined,
            phone: phone || undefined
        };

        try {
            const response = await fetch(`http://127.0.0.1:3001/doctors/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.getItem("token") || ''
                },
                body: JSON.stringify(formData)
            });

            const content = await response.json();

            if (response.ok) {
                router.push('/doctor/list');
            } else {
                setError(content.error || 'Failed to update doctor.');
            }
        } catch (err) {
            setError('Failed to update doctor.');
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Link className="font-medium text-blue-600 hover:underline" href="/doctor/list">Voltar</Link>
            <form className='w-full max-w-md mx-auto bg-white p-6 shadow-lg rounded-lg' onSubmit={edit}>
                <h1 className='text-2xl font-bold text-blue-600 mb-4'>Formulário de Edição de Médico</h1>
                <div className='mb-4'>
                    <label htmlFor="name" className='block text-sm font-bold text-gray-700'>Nome</label>
                    <input type='text' id='name' value={name} className='w-full border border-gray-300 p-2 rounded-md' onChange={(e) => setName(e.target.value)} />
                </div>
                <div className='mb-4'>
                    <label htmlFor="login" className='block text-sm font-bold text-gray-700'>Login</label>
                    <input type='text' id='login' value={login} className='w-full border border-gray-300 p-2 rounded-md' onChange={(e) => setLogin(e.target.value)} />
                </div>
                <div className='mb-4'>
                    <label htmlFor="password" className='block text-sm font-bold text-gray-700'>Senha</label>
                    <input type="password" id='password' value={password} className='w-full border border-gray-300 p-2 rounded-md' onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className='mb-4'>
                    <label htmlFor="medicalSpecialty" className='block text-sm font-bold text-gray-700'>Especialidade Médica</label>
                    <input type='text' id='medicalSpecialty' value={medicalSpecialty} className='w-full border border-gray-300 p-2 rounded-md' onChange={(e) => setMedicalSpecialty(e.target.value)} />
                </div>
                <div className='mb-4'>
                    <label htmlFor="medicalRegistration" className='block text-sm font-bold text-gray-700'>Registro Médico</label>
                    <input type='text' id='medicalRegistration' value={medicalRegistration} className='w-full border border-gray-300 p-2 rounded-md' onChange={(e) => setMedicalRegistration(e.target.value)} />
                </div>
                <div className='mb-4'>
                    <label htmlFor="email" className='block text-sm font-bold text-gray-700'>Email</label>
                    <input type='email' id='email' value={email} className='w-full border border-gray-300 p-2 rounded-md' onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className='mb-4'>
                    <label htmlFor="phone" className='block text-sm font-bold text-gray-700'>Telefone</label>
                    <input type='text' id='phone' value={phone} className='w-full border border-gray-300 p-2 rounded-md' onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className='mb-4'>
                    <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600">Atualizar</button>
                </div>
                {error && (
                    <div className="p-2 text-white border border-red-300 rounded-md bg-red-400">
                        {error}
                    </div>
                )}
            </form>
        </div>
    );
}
