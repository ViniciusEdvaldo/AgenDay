import React from 'react';
import Link from 'next/link';

export default function Home() {
    return (
        <div className="p-6 space-y-8 bg-gray-100 min-h-screen">
            <header className="bg-blue-600 text-white py-4 text-center">
                <h1 className="text-3xl font-bold">Agenday</h1>
            </header>

            <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-blue-600">Médicos</h2>
                    <div className="space-y-2">
                        <Link 
                            className="block text-blue-600 hover:text-blue-800 transition-colors duration-300" 
                            href="/doctor/create" 
                            aria-label="Criar novo médico"
                        >
                            Criar novo médico
                        </Link>
                        <Link 
                            className="block text-blue-600 hover:text-blue-800 transition-colors duration-300" 
                            href="/doctor/list" 
                            aria-label="Listar todos os médicos"
                        >
                            Listar todos os médicos
                        </Link>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-blue-600">Pacientes</h2>
                    <div className="space-y-2">
                        <Link 
                            className="block text-blue-600 hover:text-blue-800 transition-colors duration-300" 
                            href="/pacient/create" 
                            aria-label="Criar novo paciente"
                        >
                            Criar novo paciente
                        </Link>
                        <Link 
                            className="block text-blue-600 hover:text-blue-800 transition-colors duration-300" 
                            href="/pacient/list" 
                            aria-label="Listar todos os pacientes"
                        >
                            Listar todos os pacientes
                        </Link>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-blue-600">Consultas</h2>
                    <div className="space-y-2">
                        <Link 
                            className="block text-blue-600 hover:text-blue-800 transition-colors duration-300" 
                            href="/appointment/create" 
                            aria-label="Criar nova consulta"
                        >
                            Criar nova consulta
                        </Link>
                        <Link 
                            className="block text-blue-600 hover:text-blue-800 transition-colors duration-300" 
                            href="/appointment/list" 
                            aria-label="Listar todas as consultas"
                        >
                            Listar todas as consultas
                        </Link>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-blue-600">Prescrições</h2>
                    <div className="space-y-2">
                        
                        <Link 
                            className="block text-blue-600 hover:text-blue-800 transition-colors duration-300" 
                            href="prescription/upload" 
                            aria-label="Listar todas as prescrições"
                        >
                            Listar todas as prescrições
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
