"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function DoctorCreate() {
    const router = useRouter();
    const [name, setName] = useState<string>('');
    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [medicalSpecialty, setMedicalSpecialty] = useState<string>('');
    const [medicalRegistration, setMedicalRegistration] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const addDoctor = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (name && login && password && medicalSpecialty && medicalRegistration && email && phone) {
            const formData = {
                name,
                login,
                password,
                medicalSpecialty,
                medicalRegistration,
                email,
                phone
            };

            try {
                const response = await fetch('http://127.0.0.1:3001/postDoctor', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': sessionStorage.getItem("token") || ''
                    },
                    body: JSON.stringify(formData)
                });

                const content = await response.json();

                if (content.login) {
                    router.push('/home');
                } else {
                    setError(content.error);
                }
            } catch (err) {
                setError('Failed to add doctor.');
            }
        } else {
            setError('All fields are required.');
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Link className="font-medium text-blue-600 hover:underline" href="/home">Voltar</Link>
            <form className='w-full max-w-md mx-auto bg-white p-6 shadow-lg rounded-lg' onSubmit={addDoctor}>
                <h2 className='font-bold text-blue-600 py-2 block text-2xl'>Formulário Criação de Médico</h2>
                <div className='mb-4'>
                    <label htmlFor="name" className='block text-sm font-bold text-gray-700'>Nome</label>
                    <input
                        type='text'
                        id="name"
                        name='name'
                        value={name}
                        className='w-full border border-gray-300 p-2 rounded-md'
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className='mb-4'>
                    <label htmlFor="login" className='block text-sm font-bold text-gray-700'>Login</label>
                    <input
                        type='text'
                        id="login"
                        name='login'
                        value={login}
                        className='w-full border border-gray-300 p-2 rounded-md'
                        onChange={(e) => setLogin(e.target.value)}
                    />
                </div>
                <div className='mb-4'>
                    <label htmlFor="password" className='block text-sm font-bold text-gray-700'>Senha</label>
                    <input
                        type='password'
                        id="password"
                        name='password'
                        value={password}
                        className='w-full border border-gray-300 p-2 rounded-md'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className='mb-4'>
                    <label htmlFor="medicalSpecialty" className='block text-sm font-bold text-gray-700'>Especialidade Médica</label>
                    <input
                        type='text'
                        id="medicalSpecialty"
                        name='medicalSpecialty'
                        value={medicalSpecialty}
                        className='w-full border border-gray-300 p-2 rounded-md'
                        onChange={(e) => setMedicalSpecialty(e.target.value)}
                    />
                </div>
                <div className='mb-4'>
                    <label htmlFor="medicalRegistration" className='block text-sm font-bold text-gray-700'>Registro Médico</label>
                    <input
                        type='text'
                        id="medicalRegistration"
                        name='medicalRegistration'
                        value={medicalRegistration}
                        className='w-full border border-gray-300 p-2 rounded-md'
                        onChange={(e) => setMedicalRegistration(e.target.value)}
                    />
                </div>
                <div className='mb-4'>
                    <label htmlFor="email" className='block text-sm font-bold text-gray-700'>Email</label>
                    <input
                        type='email'
                        id="email"
                        name='email'
                        value={email}
                        className='w-full border border-gray-300 p-2 rounded-md'
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className='mb-4'>
                    <label htmlFor="phone" className='block text-sm font-bold text-gray-700'>Telefone</label>
                    <input
                        type='tel'
                        id="phone"
                        name='phone'
                        value={phone}
                        className='w-full border border-gray-300 p-2 rounded-md'
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                <div className='mb-4'>
                    <button type="submit" className="w-full py-2 px-4 text-white bg-green-500 border border-gray-200 rounded-md hover:bg-green-600">
                        Adicionar
                    </button>
                </div>
                {error && (
                    <div className="p-2 text-white bg-red-500 border border-red-300 rounded-md">
                        {error}
                    </div>
                )}
            </form>
        </div>
    );
}
