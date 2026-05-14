
import { useStore } from '../store/useStore';
import { Users, UserPlus, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
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
  const { players, transactions } = useStore();
  
  const totalMensalistas = players.filter(p => p.status === 'mensalista').length;
  
  const entradas = transactions.filter(t => t.type === 'entrada').reduce((acc, t) => acc + t.amount, 0);
  const saidas = transactions.filter(t => t.type === 'saida').reduce((acc, t) => acc + t.amount, 0);
  const saldo = entradas - saidas;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-500">Visão geral do seu futebol.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <div className="bg-white overflow-hidden rounded-xl shadow-sm ring-1 ring-gray-900/5">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-brand-green" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">Total Mensalistas</dt>
                  <dd>
                    <div className="text-2xl font-bold text-gray-900">{totalMensalistas}/18</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white overflow-hidden rounded-xl shadow-sm ring-1 ring-gray-900/5">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Wallet className="h-6 w-6 text-brand-gold" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">Saldo em Caixa</dt>
                  <dd>
                    <div className="text-2xl font-bold text-gray-900">
                      R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white overflow-hidden rounded-xl shadow-sm ring-1 ring-gray-900/5">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-green-500" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">Arrecadado Mês</dt>
                  <dd>
                    <div className="text-2xl font-bold text-gray-900">
                      R$ {entradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white overflow-hidden rounded-xl shadow-sm ring-1 ring-gray-900/5">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserPlus className="h-6 w-6 text-blue-500" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">Avulsos Último Jogo</dt>
                  <dd>
                    <div className="text-2xl font-bold text-gray-900">5</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">Fluxo Financeiro (Ano)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorEntradas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a472a" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1a472a" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSaidas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `R$${value/1000}k`} />
                <Tooltip />
                <Area type="monotone" dataKey="entradas" stroke="#1a472a" fillOpacity={1} fill="url(#colorEntradas)" />
                <Area type="monotone" dataKey="saidas" stroke="#ef4444" fillOpacity={1} fill="url(#colorSaidas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Últimas Transações */}
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">Últimas Movimentações</h3>
          <div className="flow-root">
            <ul role="list" className="-mb-8">
              {transactions.slice(0, 5).map((transaction, transactionIdx) => (
                <li key={transaction.id}>
                  <div className="relative pb-8">
                    {transactionIdx !== transactions.length - 1 ? (
                      <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className={cn(
                          transaction.type === 'entrada' ? 'bg-green-100' : 'bg-red-100',
                          'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white'
                        )}>
                          {transaction.type === 'entrada' 
                            ? <ArrowUpRight className="h-5 w-5 text-green-600" aria-hidden="true" />
                            : <ArrowDownRight className="h-5 w-5 text-red-600" aria-hidden="true" />
                          }
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p className="text-sm text-gray-500">
                            {transaction.description}
                          </p>
                        </div>
                        <div className="whitespace-nowrap text-right text-sm font-medium">
                          <span className={transaction.type === 'entrada' ? 'text-green-600' : 'text-red-600'}>
                            {transaction.type === 'entrada' ? '+' : '-'} R$ {transaction.amount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
