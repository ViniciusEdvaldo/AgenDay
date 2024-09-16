"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function PacientCreate() {
    const router = useRouter();

    const [name, setName] = useState<string>('');
    const [birthDate, setBirthDate] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const addPacient = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (name && birthDate && email && phone) {
            const formData = {
                name,
                birthDate,
                email,
                phone
            };

            try {
                const response = await fetch('http://127.0.0.1:3001/postPacient', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': sessionStorage.getItem("token") || ''
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const content = await response.json();

                if (content.name) {
                    router.push('/pacient/list');
                } else {
                    setError(content.error || 'Failed to add patient.');
                }
            } catch (err) {
                setError('An error occurred while adding the patient.');
            }
        } else {
            setError('Please fill in all fields.');
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Link className="font-medium text-blue-600 hover:underline" href="/home">Voltar</Link>
            <form className='w-full max-w-md mx-auto bg-white p-6 shadow-lg rounded-lg' onSubmit={addPacient}>
                <h2 className='font-bold text-blue-600 py-2 block text-2xl'>Formulário Criação de Paciente</h2>
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
                    <label htmlFor="birthDate" className='block text-sm font-bold text-gray-700'>Nascimento</label>
                    <input
                        type="date"
                        id="birthDate"
                        name='birthDate'
                        value={birthDate}
                        className='w-full border border-gray-300 p-2 rounded-md'
                        onChange={(e) => setBirthDate(e.target.value)}
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
