"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function PacientEdit(params: any) {
    const router = useRouter();

    const [name, setName] = useState<string>('');
    const [birthDate, setBirthDate] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [pacient, setPacient] = useState({ name, birthDate, email, phone });

    const id = params.params.id;

    useEffect(() => {
        fetch('http://127.0.0.1:3001/getPacient/' + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem("token") || ''
            },
        })
        .then(response => response.json())
        .then(data => {
            const formattedBirthDate = data.birthDate.substring(8,10) + "/" + data.birthDate.substring(5,7) + "/" + data.birthDate.substring(0,4);
            setPacient({ ...data, birthDate: formattedBirthDate });
            setName(data.name);
            setBirthDate(formattedBirthDate);
            setEmail(data.email);
            setPhone(data.phone);
        });
    }, [id]);

    const edit = async (e: any) => {
        e.preventDefault();
        setError(null);

        const formattedBirthDate = birthDate.split('/').reverse().join('-'); // Format to YYYY-MM-DD

        const formData = {
            name: name || pacient.name,
            birthDate: formattedBirthDate || pacient.birthDate,
            email: email || pacient.email,
            phone: phone || pacient.phone
        };

        try {
            const response = await fetch('http://127.0.0.1:3001/pacients/' + id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.getItem("token") || ''
                },
                body: JSON.stringify(formData)
            });

            const content = await response.json();

            if (content.name) {
                router.push('/home');
            } else {
                setError(content.error);
            }
        } catch (error) {
            setError('Ocorreu um erro ao atualizar o paciente.');
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
            <Link href="/pacient/list" className="text-blue-600 hover:underline mb-6">
                Voltar
            </Link>

            <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-2xl font-bold text-blue-600 mb-6">Editar Paciente</h2>

                <form onSubmit={edit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
                        <input 
                            type="text" 
                            id="name" 
                            value={name} 
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            onChange={(e: any) => setName(e.target.value)} 
                        />
                    </div>

                    <div>
                        <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
                        <input 
                            type="text" 
                            id="birthDate" 
                            value={birthDate} 
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            onChange={(e: any) => setBirthDate(e.target.value)} 
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            value={email} 
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            onChange={(e: any) => setEmail(e.target.value)} 
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone</label>
                        <input 
                            type="text" 
                            id="phone" 
                            value={phone} 
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            onChange={(e: any) => setPhone(e.target.value)} 
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full py-3 text-white bg-green-500 rounded-lg shadow-sm hover:bg-green-600 transition-colors duration-300"
                    >
                        Atualizar
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
