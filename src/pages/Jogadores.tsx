import { useState } from 'react';
import { useStore } from '../store/useStore';
import { UserPlus, Search, Phone, Calendar, Pencil, Trash2 } from 'lucide-react';
import type { Player } from '../types';
import { cn } from '../utils/cn'; // I need to create this util

export function Jogadores() {
  const { players, addPlayer, updatePlayer, deletePlayer } = useStore();
  const isAdmin = useStore(state => state.user)?.role === 'admin';
  const [activeTab, setActiveTab] = useState<'mensalistas' | 'avulsos'>('mensalistas');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [position, setPosition] = useState('Atacante');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'mensalista' | 'avulso'>('mensalista');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openModal = (player?: Player) => {
    if (player) {
      setEditingPlayer(player);
      setName(player.name);
      setNickname(player.nickname);
      setPosition(player.position);
      setPhone(player.phone);
      setStatus(player.status);
    } else {
      setEditingPlayer(null);
      setName('');
      setNickname('');
      setPosition('Atacante');
      setPhone('');
      setStatus('mensalista');
    }
    setShowModal(true);
  };

  const handleDelete = async (id: string, playerName: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o jogador ${playerName}?`)) {
      try {
        await deletePlayer(id);
      } catch (e) {
        // Erro já tratado no store
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingPlayer) {
        await updatePlayer({
          ...editingPlayer,
          name,
          nickname: nickname || name.split(' ')[0],
          position,
          phone,
          status
        });
      } else {
        await addPlayer({
          name,
          nickname: nickname || name.split(' ')[0],
          position,
          phone,
          status
        });
      }
      setShowModal(false);
    } catch (err) {
      // Erro tratado
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPlayers = players.filter(
    (p) => (p.status === (activeTab === 'mensalistas' ? 'mensalista' : 'avulso')) && p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Jogadores</h2>
          <p className="text-sm text-gray-500">Gerencie mensalistas e jogadores avulsos.</p>
        </div>
        {isAdmin && (
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              onClick={() => openModal()}
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
          <div key={player.id} className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-xl bg-white text-center shadow-sm ring-1 ring-gray-900/5 transition-all hover:shadow-md relative">
            {isAdmin && (
              <div className="absolute top-2 right-2 flex gap-1 z-10">
                <button onClick={() => openModal(player)} className="p-1.5 text-gray-400 hover:text-brand-green bg-white/80 rounded-full hover:bg-green-50" title="Editar">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(player.id, player.name)} className="p-1.5 text-gray-400 hover:text-red-600 bg-white/80 rounded-full hover:bg-red-50" title="Excluir">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="flex flex-1 flex-col p-8 pt-10">
              <img className="mx-auto h-24 w-24 flex-shrink-0 rounded-full object-cover ring-2 ring-brand-gold/50" src={player.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name)}&background=10B981&color=fff`} alt="" />
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

      {/* Modal Adicionar Jogador */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">{editingPlayer ? 'Editar Jogador' : 'Novo Jogador'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green focus:ring-brand-green sm:text-sm px-3 py-2 border" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Apelido/Camisa</label>
                  <input type="text" value={nickname} onChange={e => setNickname(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green focus:ring-brand-green sm:text-sm px-3 py-2 border" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Posição</label>
                  <select value={position} onChange={e => setPosition(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green focus:ring-brand-green sm:text-sm px-3 py-2 border">
                    <option>Goleiro</option>
                    <option>Zagueiro</option>
                    <option>Lateral</option>
                    <option>Meia</option>
                    <option>Atacante</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefone/WhatsApp</label>
                  <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(00) 00000-0000" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green focus:ring-brand-green sm:text-sm px-3 py-2 border" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value as any)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-green focus:ring-brand-green sm:text-sm px-3 py-2 border">
                    <option value="mensalista">Mensalista</option>
                    <option value="avulso">Avulso</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-brand-green border border-transparent rounded-md hover:bg-brand-green/90 disabled:opacity-50">
                  {isSubmitting ? 'Salvando...' : (editingPlayer ? 'Atualizar Jogador' : 'Salvar Jogador')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
