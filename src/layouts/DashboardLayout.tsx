import { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  CalendarDays, 
  FileBarChart, 
  MessageSquare,
  Menu,
  LogOut,
  Trophy
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { supabase } from '../lib/supabase';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Jogadores', href: '/jogadores', icon: Users },
  { name: 'Caixa Financeiro', href: '/financeiro', icon: Wallet },
  { name: 'Jogos e Avulsos', href: '/jogos', icon: CalendarDays },
  { name: 'Relatórios', href: '/relatorios', icon: FileBarChart },
  { name: 'Resenha', href: '/resenha', icon: MessageSquare },
];

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useStore();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-brand-dark text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 shrink-0 items-center gap-2 px-6 bg-black/20">
          <Trophy className="h-8 w-8 text-brand-gold" />
          <span className="text-lg font-bold tracking-wider">SC FUTEBOL</span>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <nav className="mt-5 flex-1 space-y-1 px-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    isActive
                      ? 'bg-brand-green text-white'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white',
                    'group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors'
                  )}
                >
                  <item.icon
                    className={cn(
                      isActive ? 'text-brand-gold' : 'text-gray-400 group-hover:text-brand-gold',
                      'mr-3 h-5 w-5 shrink-0 transition-colors'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white rounded-md transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-400" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
          <button
            type="button"
            className="text-gray-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Abrir sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          
          <div className="flex flex-1 justify-end items-center gap-4">
             <div className="flex items-center gap-3">
               <div className="text-right hidden sm:block">
                 <p className="text-sm font-medium text-gray-900">{user?.name || 'Usuário'}</p>
                 <p className="text-xs text-gray-500 capitalize">{user?.role === 'admin' ? 'Gestor da Pelada' : 'Jogador'}</p>
               </div>
               <img
                 className="h-9 w-9 rounded-full object-cover ring-2 ring-brand-gold ring-offset-2"
                 src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=111827&color=d4af37`}
                 alt="Avatar"
               />
             </div>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
