import { useStore } from '../store/useStore';
import { Shirt, Trophy, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, Goal, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../utils/cn';

const data = [
  { name: 'Jan', entradas: 4000, saidas: 2400 },
  { name: 'Fev', entradas: 3000, saidas: 1398 },
  { name: 'Mar', entradas: 2000, saidas: 9800 },
  { name: 'Abr', entradas: 2780, saidas: 3908 },
  { name: 'Mai', entradas: 1890, saidas: 4800 },
  { name: 'Jun', entradas: 2390, saidas: 3800 },
  { name: 'Jul', entradas: 3490, saidas: 4300 },
];

export function Dashboard() {
  const { players, transactions, matches } = useStore();
  
  const totalMensalistas = players.filter(p => p.status === 'mensalista').length;
  
  const entradas = transactions.filter(t => t.type === 'entrada').reduce((acc, t) => acc + t.amount, 0);
  const saidas = transactions.filter(t => t.type === 'saida').reduce((acc, t) => acc + t.amount, 0);
  const saldo = entradas - saidas;
  
  const totalJogosAno = matches.length;

  return (
    <div className="space-y-8 -mt-6">
      {/* Hero Section / Banner Tático */}
      <div className="relative rounded-2xl overflow-hidden bg-brand-dark shadow-2xl">
        {/* Background Pattern de Campo de Futebol (CSS puro) */}
        <div className="absolute inset-0 opacity-10" 
             style={{ 
               backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.5) 2px, transparent 2px), linear-gradient(rgba(255,255,255,0.28) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.28) 1px, transparent 1px)`,
               backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
               backgroundPosition: '-2px -2px, -2px -2px, -1px -1px, -1px -1px'
             }}>
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        
        <div className="relative px-6 py-12 sm:px-10 sm:py-16">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="h-8 w-8 text-brand-gold" />
            <h2 className="text-3xl font-extrabold tracking-tight text-white uppercase italic">Painel Tático</h2>
          </div>
          <p className="text-lg text-gray-300 max-w-xl">
            Resumo da temporada do seu time. Acompanhe o elenco, o caixa e o histórico de partidas em tempo real.
          </p>
        </div>
      </div>

      {/* Cards de Estatísticas (Glassmorphism & Dark Mode) */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Elenco */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-black p-6 shadow-xl border border-gray-800 hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute -right-4 -top-4 opacity-5">
            <Shirt className="h-32 w-32" />
          </div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-500/10 p-3 rounded-xl border border-green-500/20">
                <Shirt className="h-6 w-6 text-green-400" aria-hidden="true" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Elenco</span>
            </div>
            <dl>
              <dt className="text-sm font-medium text-gray-400">Total Mensalistas</dt>
              <dd className="mt-1 flex items-baseline gap-2">
                <div className="text-3xl font-bold text-white">{totalMensalistas}</div>
                <div className="text-sm font-medium text-gray-500">/18 Atletas</div>
              </dd>
            </dl>
          </div>
        </div>

        {/* Card 2: Saldo Premium */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a472a] to-black p-6 shadow-xl border border-brand-gold/20 hover:-translate-y-1 transition-transform duration-300">
           <div className="absolute -right-4 -top-4 opacity-5">
            <Wallet className="h-32 w-32" />
          </div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-brand-gold/10 p-3 rounded-xl border border-brand-gold/20">
                <Wallet className="h-6 w-6 text-brand-gold" aria-hidden="true" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-gold/50">Caixa</span>
            </div>
            <dl>
              <dt className="text-sm font-medium text-brand-gold/70">Saldo do Clube</dt>
              <dd className="mt-1 flex items-baseline gap-2">
                <div className="text-3xl font-bold text-brand-gold">
                  R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </dd>
            </dl>
          </div>
        </div>

        {/* Card 3: Arrecadado */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-black p-6 shadow-xl border border-gray-800 hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute -right-4 -top-4 opacity-5">
            <TrendingUp className="h-32 w-32" />
          </div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
                <TrendingUp className="h-6 w-6 text-blue-400" aria-hidden="true" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Mês</span>
            </div>
            <dl>
              <dt className="text-sm font-medium text-gray-400">Total Arrecadado</dt>
              <dd className="mt-1 flex items-baseline gap-2">
                <div className="text-3xl font-bold text-white">
                  R$ {entradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </dd>
            </dl>
          </div>
        </div>

        {/* Card 4: Partidas */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-black p-6 shadow-xl border border-gray-800 hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute -right-4 -top-4 opacity-5">
            <Activity className="h-32 w-32" />
          </div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-500/10 p-3 rounded-xl border border-purple-500/20">
                <Activity className="h-6 w-6 text-purple-400" aria-hidden="true" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Temporada</span>
            </div>
            <dl>
              <dt className="text-sm font-medium text-gray-400">Partidas Realizadas</dt>
              <dd className="mt-1 flex items-baseline gap-2">
                <div className="text-3xl font-bold text-white">{totalJogosAno}</div>
                <div className="text-sm font-medium text-gray-500">Jogos</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico Dark Theme */}
        <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-xl border border-gray-800 p-6 relative overflow-hidden">
          {/* Luz de fundo sutil no gráfico */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-brand-green/20 blur-[100px] rounded-full pointer-events-none"></div>
          
          <h3 className="text-base font-bold uppercase tracking-wider text-white mb-6 flex items-center gap-2 relative z-10">
            <TrendingUp className="h-5 w-5 text-brand-gold" />
            Desempenho Financeiro
          </h3>
          <div className="h-72 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorEntradas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4af37" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSaidas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#9CA3AF" />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `R$${value/1000}k`} stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="entradas" stroke="#d4af37" strokeWidth={3} fillOpacity={1} fill="url(#colorEntradas)" />
                <Area type="monotone" dataKey="saidas" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorSaidas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Últimas Transações - Match Events Style */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-base font-bold uppercase tracking-wider text-gray-900 mb-6 flex items-center gap-2">
            <Goal className="h-5 w-5 text-brand-green" />
            Últimos Lances (Caixa)
          </h3>
          <div className="flow-root">
            <ul role="list" className="-mb-8">
              {transactions.slice(0, 5).map((transaction, transactionIdx) => (
                <li key={transaction.id}>
                  <div className="relative pb-8">
                    {transactionIdx !== Math.min(transactions.length - 1, 4) ? (
                      <span className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                    ) : null}
                    <div className="relative flex items-start space-x-3">
                      <div className="relative">
                        <span className={cn(
                          transaction.type === 'entrada' ? 'bg-green-50 ring-green-100' : 'bg-red-50 ring-red-100',
                          'h-10 w-10 rounded-full flex items-center justify-center ring-8 ring-white'
                        )}>
                          {transaction.type === 'entrada' 
                            ? <ArrowUpRight className="h-5 w-5 text-green-600" aria-hidden="true" />
                            : <ArrowDownRight className="h-5 w-5 text-red-600" aria-hidden="true" />
                          }
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 py-1.5">
                        <div className="text-sm text-gray-500 font-medium mb-1">
                          {transaction.description}
                        </div>
                        <div className={cn(
                          "text-lg font-bold",
                          transaction.type === 'entrada' ? 'text-green-600' : 'text-red-600'
                        )}>
                          {transaction.type === 'entrada' ? '+' : '-'} R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
              {transactions.length === 0 && (
                <div className="text-center text-sm text-gray-500 py-4">Nenhuma movimentação no caixa.</div>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
