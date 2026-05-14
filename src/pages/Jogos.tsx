import React from 'react';
import { useStore } from '../store/useStore';
import { Calendar, MapPin, Clock, Users, Plus } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function Jogos() {
  const { matches } = useStore();

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
                  <span>{match.participants.length} Jogadores (4 Avulsos)</span>
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
    </div>
  );
}
