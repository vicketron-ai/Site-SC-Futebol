import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Calendar, MapPin, Clock, Users, Plus } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function Jogos() {
  const { matches, addMatch } = useStore();
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('20:00');
  const [location, setLocation] = useState('Arena SC Futebol');
  const [fee, setFee] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await addMatch({
      date: new Date(date).toISOString(),
      time,
      location,
      fee: parseFloat(fee) || 0
    });
    setIsSubmitting(false);
    setShowModal(false);
    setFee('');
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Histórico de Jogos</h2>
          <p className="text-sm text-gray-500">Controle as partidas, presenças e avulsos.</p>
        </div>
        {useStore(state => state.user)?.role === 'admin' && (
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              onClick={() => setShowModal(true)}
              type="button"
              className="flex items-center justify-center gap-2 rounded-md bg-brand-green px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-green/90"
            >
              <Plus className="h-4 w-4" />
              Nova Partida
            </button>
          </div>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {matches.map((match) => (
          <div key={match.id} className="bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 overflow-hidden hover:shadow-md transition-all cursor-pointer">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-brand-green font-semibold">
                  <Calendar className="h-5 w-5" />
                  <span>{format(parseISO(match.date), "dd 'de' MMMM", { locale: ptBR })}</span>
                </div>
                <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                  Concluído
                </span>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{match.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{match.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span>{match.participants?.length || 0} Jogadores (4 Avulsos)</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center text-sm">
              <span className="text-gray-500">Arrecadado avulsos:</span>
              <span className="font-semibold text-green-600">
                R$ {(4 * match.fee).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        ))}
        {matches.length === 0 && (
          <div className="col-span-full bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 p-12 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhum jogo registrado</h3>
            <p className="mt-1 text-sm text-gray-500">Comece adicionando uma nova partida.</p>
          </div>
        )}
      </div>

      {/* Modal Adicionar Partida */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Nova Partida</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Data</label>
                  <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green focus:ring-brand-green sm:text-sm px-3 py-2 border" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Horário</label>
                  <input required type="time" value={time} onChange={e => setTime(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green focus:ring-brand-green sm:text-sm px-3 py-2 border" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Local da Partida</label>
                <input required type="text" value={location} onChange={e => setLocation(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green focus:ring-brand-green sm:text-sm px-3 py-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Valor para Avulsos (R$)</label>
                <input required type="number" step="0.01" min="0" value={fee} onChange={e => setFee(e.target.value)} placeholder="0.00" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green focus:ring-brand-green sm:text-sm px-3 py-2 border" />
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-brand-green border border-transparent rounded-md hover:bg-brand-green/90 disabled:opacity-50">
                  {isSubmitting ? 'Salvando...' : 'Criar Partida'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
