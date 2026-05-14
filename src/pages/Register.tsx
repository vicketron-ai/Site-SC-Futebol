import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trophy, UserPlus } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (email && password && name) {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          }
        }
      });
      
      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        // Normalmente o Supabase envia um e-mail de confirmação.
        // Se a confirmação automática estiver ativada, ele já loga.
        navigate('/');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl ring-1 ring-gray-900/5">
        <div>
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-brand-dark rounded-full flex items-center justify-center shadow-lg">
              <Trophy className="h-8 w-8 text-brand-gold" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Nova Conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Junte-se ao SC Futebol
          </p>
        </div>
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
            Erro ao criar conta: {error}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome Completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 mt-1 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-brand-green focus:border-brand-green focus:z-10 sm:text-sm"
                placeholder="Seu nome"
              />
            </div>
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                Endereço de E-mail
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 mt-1 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-brand-green focus:border-brand-green focus:z-10 sm:text-sm"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 mt-1 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-brand-green focus:border-brand-green focus:z-10 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-brand-green hover:bg-brand-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green shadow-md transition-colors disabled:opacity-50"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <UserPlus className="h-5 w-5 text-brand-gold group-hover:scale-110 transition-transform" aria-hidden="true" />
              </span>
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </div>
          
          <div className="mt-4 text-center text-sm text-gray-600">
            Já possui uma conta?{' '}
            <Link to="/login" className="font-medium text-brand-green hover:text-brand-green/80">
              Faça login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
