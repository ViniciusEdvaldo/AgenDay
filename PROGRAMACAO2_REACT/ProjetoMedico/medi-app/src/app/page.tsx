"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [login, setLogin] = useState<string>(''); 
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const authentication = async (e: any) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const predefinedLogin = "Lotus";
    const predefinedPassword = "procuroEstagio";

    if (login && password) {
      if (login === predefinedLogin && password === predefinedPassword) {
        
        sessionStorage.setItem("token", "mockToken");
        router.push('/home'); 
      } else {
        setError("Credenciais inválidas");
      }
      setLoading(false);
    } else {
      setError("Por favor, preencha todos os campos");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center flex-grow p-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-blue-500 mb-2">Agenday</h1>
          <p className="text-lg text-gray-600">Um sistema para consultório para agendamento de consultas.</p>
        </div>

        <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
          <h2 className="text-3xl font-bold text-center text-blue-500 mb-6">Login</h2>

          <form onSubmit={authentication}>
            <div className="w-full mb-4">
              <label htmlFor="login" className="block text-sm font-medium text-gray-700">Usuário</label>
              <input 
                type="text" 
                name="login" 
                placeholder="Digite seu usuário" 
                className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                onChange={(e: any) => setLogin(e.target.value)} 
                disabled={loading}
              />
            </div>

            <div className="w-full mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
              <input 
                type="password" 
                name="password" 
                placeholder="Digite sua senha" 
                className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e: any) => setPassword(e.target.value)} 
                disabled={loading}
              />
            </div>

            {error && (
              <div className="mb-4 p-2 text-red-700 bg-red-100 border border-red-300 rounded-lg">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className={`w-full py-3 font-semibold text-white rounded-lg transition-all duration-300 ease-in-out ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`} 
              disabled={loading}
            >
              {loading ? 'Carregando...' : 'Entrar'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Esqueceu a senha? <a href="#" className="text-blue-500 hover:underline">Recuperar</a>
          </p>
        </div>
      </div>

      <div className="fixed top-4 right-4 bg-blue-100 border border-blue-300 text-blue-700 px-4 py-2 rounded shadow-md text-sm">
        <p><strong>Usuário:</strong> Lotus</p>
        <p><strong>Senha:</strong> procuroEstagio</p>
      </div>
    </div>
  );
}
