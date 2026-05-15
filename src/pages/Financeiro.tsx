import { useState } from 'react';
import { useStore } from '../store/useStore';
import { PlusCircle, MinusCircle, ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../utils/cn';

export function Financeiro() {
  const { transactions, addTransaction } = useStore();
  const [filterType, setFilterType] = useState<'all' | 'entrada' | 'saida'>('all');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'entrada' | 'saida'>('entrada');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('mensalidade');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openModal = (type: 'entrada' | 'saida') => {
    setModalType(type);
    setCategory(type === 'entrada' ? 'mensalidade' : 'aluguel_campo');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await addTransaction({
      type: modalType,
      amount: parseFloat(amount),
      date: new Date(date).toISOString(),
      description,
      category: category as any
    });
    setIsSubmitting(false);
    setShowModal(false);
    setAmount('');
    setDescription('');
  };

  const entradas = transactions.filter(t => t.type === 'entrada').reduce((acc, t) => acc + t.amount, 0);
  const saidas = transactions.filter(t => t.type === 'saida').reduce((acc, t) => acc + t.amount, 0);
  const saldo = entradas - saidas;

  const filteredTransactions = transactions
    .filter(t => filterType === 'all' || t.type === filterType)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Caixa Financeiro</h2>
          <p className="text-sm text-gray-500">Gestão de entradas, saídas e reserva financeira.</p>
        </div>
        {useStore(state => state.user)?.role === 'admin' && (
          <div className="mt-4 flex gap-3 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              onClick={() => openModal('entrada')}
              type="button"
              className="flex items-center justify-center gap-2 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
            >
              <PlusCircle className="h-4 w-4" />
              Nova Entrada
            </button>
            <button
              onClick={() => openModal('saida')}
              type="button"
              className="flex items-center justify-center gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
            >
              <MinusCircle className="h-4 w-4" />
              Nova Saída
            </button>
          </div>
        )}
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="overflow-hidden rounded-xl bg-white px-4 py-5 shadow-sm ring-1 ring-gray-900/5 sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Total Arrecadado</dt>
          <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
            <div className="flex items-baseline text-2xl font-bold text-green-600">
              R$ {entradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </dd>
        </div>
        <div className="overflow-hidden rounded-xl bg-white px-4 py-5 shadow-sm ring-1 ring-gray-900/5 sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Total Gasto</dt>
          <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
            <div className="flex items-baseline text-2xl font-bold text-red-600">
              R$ {saidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </dd>
        </div>
        <div className="overflow-hidden rounded-xl bg-brand-dark px-4 py-5 shadow-sm ring-1 ring-brand-dark/5 sm:p-6 relative">
          <div className="absolute inset-0 bg-brand-gold/5"></div>
          <dt className="truncate text-sm font-medium text-gray-300 relative z-10">Reserva (Saldo Atual)</dt>
          <dd className="mt-1 flex items-baseline justify-between md:block lg:flex relative z-10">
            <div className="flex items-baseline text-2xl font-bold text-brand-gold">
              R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </dd>
        </div>
      </div>

      {/* Tabela de Transações */}
      <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 overflow-hidden">
        <div className="border-b border-gray-200 px-4 py-4 sm:px-6 flex items-center justify-between">
          <h3 className="text-base font-semibold leading-6 text-gray-900">Histórico de Movimentações</h3>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-brand-green sm:text-sm sm:leading-6"
            >
              <option value="all">Todas as Movimentações</option>
              <option value="entrada">Apenas Entradas</option>
              <option value="saida">Apenas Saídas</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Data</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Descrição</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Categoria</th>
                <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                    {format(parseISO(transaction.date), "dd 'de' MMM, yyyy", { locale: ptBR })}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        transaction.type === 'entrada' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600',
                        'p-1 rounded-full'
                      )}>
                        {transaction.type === 'entrada' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                      </span>
                      {transaction.description}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">
                    {transaction.category.replace('_', ' ')}
                  </td>
                  <td className={cn(
                    "whitespace-nowrap px-3 py-4 text-sm text-right font-medium",
                    transaction.type === 'entrada' ? 'text-green-600' : 'text-red-600'
                  )}>
                    {transaction.type === 'entrada' ? '+' : '-'} R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-sm text-gray-500">
                    Nenhuma movimentação encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Adicionar Transação */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className={cn("px-6 py-4 border-b flex justify-between items-center", modalType === 'entrada' ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100')}>
              <h3 className={cn("text-lg font-bold", modalType === 'entrada' ? 'text-green-800' : 'text-red-800')}>
                {modalType === 'entrada' ? 'Nova Receita' : 'Nova Despesa'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Valor (R$)</label>
                <input required type="number" step="0.01" min="0" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green focus:ring-brand-green sm:text-sm px-3 py-2 border" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <input required type="text" value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green focus:ring-brand-green sm:text-sm px-3 py-2 border" placeholder="Ex: Mensalidade João" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Data</label>
                  <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green focus:ring-brand-green sm:text-sm px-3 py-2 border" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Categoria</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green focus:ring-brand-green sm:text-sm px-3 py-2 border">
                    {modalType === 'entrada' ? (
                      <>
                        <option value="mensalidade">Mensalidade</option>
                        <option value="pagamento_avulso">Avulso</option>
                        <option value="outras_receitas">Outras Receitas</option>
                      </>
                    ) : (
                      <>
                        <option value="aluguel_campo">Aluguel do Campo</option>
                        <option value="arbitragem">Arbitragem</option>
                        <option value="churrasco">Churrasco</option>
                        <option value="bebidas">Bebidas</option>
                        <option value="uniformes">Uniformes</option>
                        <option value="bolas">Bolas</option>
                        <option value="outras_despesas">Outras Despesas</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className={cn("px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md disabled:opacity-50", modalType === 'entrada' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700')}>
                  {isSubmitting ? 'Salvando...' : 'Confirmar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
