import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { Jogadores } from './pages/Jogadores';
import { Financeiro } from './pages/Financeiro';
import { Jogos } from './pages/Jogos';
import { Resenha } from './pages/Resenha';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { useStore } from './store/useStore';
import { supabase } from './lib/supabase';

// E-mail do administrador principal
const ADMIN_EMAIL = 'vicketron@gmail.com'; // Altere para o SEU e-mail

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useStore(state => state.user);
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  const { setUser, fetchData } = useStore();
  const [loading, setLoading] = useState(true);

  const processSession = async (session: any) => {
    if (session?.user) {
      const meta = session.user.user_metadata;
      // Garante que APENAS este e-mail será admin
      const isAdmin = session.user.email === ADMIN_EMAIL;
      setUser({
        id: session.user.id,
        email: session.user.email ?? '',
        name: meta?.name ?? session.user.email?.split('@')[0] ?? 'Usuário',
        role: isAdmin ? 'admin' : 'player',
      });
      await fetchData();
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      await processSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await processSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-brand-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="jogadores" element={<Jogadores />} />
          <Route path="financeiro" element={<Financeiro />} />
          <Route path="jogos" element={<Jogos />} />
          <Route path="relatorios" element={<div className="p-4">Página em Construção: Relatórios</div>} />
          <Route path="resenha" element={<Resenha />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
