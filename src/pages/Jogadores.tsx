import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { UserPlus, Search, Phone, Calendar } from 'lucide-react';
import { cn } from '../utils/cn'; // I need to create this util

export function Jogadores() {
  const { players } = useStore();
  const [activeTab, setActiveTab] = useState<'mensalistas' | 'avulsos'>('mensalistas');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlayers = players.filter(
    (p) => p.status === activeTab && p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Jogadores</h2>
          <p className="text-sm text-gray-500">Gerencie mensalistas e jogadores avulsos.</p>
        </div>
        {useStore(state => state.user)?.role === 'admin' && (
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-md bg-brand-green px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-green/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
            >
              <UserPlus className="h-4 w-4" />
              Adicionar Jogador
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('mensalistas')}
              className={cn(
                activeTab === 'mensalistas'
                  ? 'border-brand-green text-brand-green'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
              )}
            >
              Mensalistas ({players.filter(p => p.status === 'mensalista').length}/18)
            </button>
            <button
              onClick={() => setActiveTab('avulsos')}
              className={cn(
                activeTab === 'avulsos'
                  ? 'border-brand-green text-brand-green'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
              )}
            >
              Avulsos ({players.filter(p => p.status === 'avulso').length})
            </button>
          </nav>
        </div>

        {/* Search */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-green sm:text-sm sm:leading-6"
            placeholder="Buscar jogador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid de Jogadores */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredPlayers.map((player) => (
          <div key={player.id} className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-xl bg-white text-center shadow-sm ring-1 ring-gray-900/5 transition-all hover:shadow-md">
            <div className="flex flex-1 flex-col p-8">
              <img className="mx-auto h-24 w-24 flex-shrink-0 rounded-full object-cover ring-2 ring-brand-gold/50" src={player.photoUrl} alt="" />
              <h3 className="mt-6 text-sm font-medium text-gray-900">{player.name}</h3>
              <dl className="mt-1 flex flex-grow flex-col justify-between">
                <dt className="sr-only">Apelido</dt>
                <dd className="text-sm text-gray-500">{player.nickname}</dd>
                <dt className="sr-only">Posição</dt>
                <dd className="mt-3">
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    {player.position}
                  </span>
                </dd>
              </dl>
            </div>
            <div>
              <div className="-mt-px flex divide-x divide-gray-200">
                <div className="flex w-0 flex-1">
                  <a
                    href={`tel:${player.phone}`}
                    className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    <Phone className="h-4 w-4 text-gray-400" aria-hidden="true" />
                    Ligar
                  </a>
                </div>
                <div className="-ml-px flex w-0 flex-1">
                  <button className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900 hover:bg-gray-50">
                    <Calendar className="h-4 w-4 text-gray-400" aria-hidden="true" />
                    Histórico
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredPlayers.length === 0 && (
          <div className="col-span-full py-12 text-center text-sm text-gray-500">
            Nenhum jogador encontrado.
          </div>
        )}
      </div>
    </div>
  );
}
