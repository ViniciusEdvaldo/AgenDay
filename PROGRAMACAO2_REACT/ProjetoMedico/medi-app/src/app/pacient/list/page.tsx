"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Pacient {
    _id: string;
    name: string;
    birthDate: string;
    email: string;
    phone: string;
}

export default function PacientList() {
    const [pacients, setPacients] = useState<Pacient[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchPacients = async () => {
        setLoading(true);
        setError(null); // Limpa qualquer erro anterior
        try {
            const response = await fetch('http://127.0.0.1:3001/pacients', {
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
            setPacients(data);
        } catch (err: any) {
            setError(`Failed to fetch patients: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const deletePacient = async (id: string) => {
        try {
            const response = await fetch(`http://127.0.0.1:3001/pacients/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.getItem("token") || ''
                },
            });

            if (!response.ok) {
                const content = await response.json();
                throw new Error(content.error || 'Failed to delete patient.');
            }

            // Recarregar a lista de pacientes
            setPacients(pacients.filter(pacient => pacient._id !== id));
        } catch (err: any) {
            setError(`Failed to delete patient: ${err.message}`);
        }
    };

    useEffect(() => {
        fetchPacients();
    }, []);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Link className="font-medium text-blue-600 hover:underline" href="/home">Voltar</Link>
            <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Lista de Pacientes</h2>
                
                {loading && (
                    <div className="text-center text-blue-600">Carregando...</div>
                )}

                <table className='w-full border-collapse'>
                    <thead>
                        <tr>
                            <th className='border-b border-blue-300 py-2 px-4 text-left text-blue-600'>Nome</th>
                            <th className='border-b border-blue-300 py-2 px-4 text-left text-blue-600'>Nascimento</th>
                            <th className='border-b border-blue-300 py-2 px-4 text-left text-blue-600'>Email</th>
                            <th className='border-b border-blue-300 py-2 px-4 text-left text-blue-600'>Telefone</th>
                            <th className='border-b border-blue-300 py-2 px-4 text-left text-blue-600'>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pacients.length > 0 ? pacients.map((pacient) => (
                            <tr key={pacient._id}>
                                <td className='border-b border-blue-200 py-2 px-4'>{pacient.name}</td>
                                <td className='border-b border-blue-200 py-2 px-4'>{new Date(pacient.birthDate).toLocaleDateString()}</td>
                                <td className='border-b border-blue-200 py-2 px-4'>{pacient.email}</td>
                                <td className='border-b border-blue-200 py-2 px-4'>{pacient.phone}</td>
                                <td className='border-b border-blue-200 py-2 px-4 flex space-x-2'>
                                    <button 
                                        onClick={() => deletePacient(pacient._id)} 
                                        className='bg-red-500 hover:bg-red-600 text-white p-2 rounded-md text-sm'
                                    >
                                        Deletar
                                    </button>
                                    <Link 
                                        href={`/pacient/edit/${pacient._id}`} 
                                        className='bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-md text-sm'
                                    >
                                        Editar
                                    </Link>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className='border-b border-blue-200 py-2 px-4 text-center'>
                                    Nenhum paciente encontrado
                                </td>
                            </tr>
                        )}
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
