import { useState } from 'react';
import { MessageSquare, Trophy, Beer, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function Resenha() {
  const { announcements, events, user, addAnnouncement, deleteAnnouncement, addEvent, deleteEvent } = useStore();
  
  const [showAvisoForm, setShowAvisoForm] = useState(false);
  const [showEventoForm, setShowEventoForm] = useState(false);
  
  // Forms state
  const [avisoType, setAvisoType] = useState<'warning'|'info'>('info');
  const [avisoTitle, setAvisoTitle] = useState('');
  const [avisoDesc, setAvisoDesc] = useState('');
  
  const [eventoTitle, setEventoTitle] = useState('');
  const [eventoDate, setEventoDate] = useState('');
  const [eventoLocation, setEventoLocation] = useState('');
  const [eventoDesc, setEventoDesc] = useState('');

  const isAdmin = user?.role === 'admin';

  const handleAddAviso = async (e: React.FormEvent) => {
    e.preventDefault();
    if (avisoTitle && avisoDesc) {
      await addAnnouncement({ type: avisoType, title: avisoTitle, description: avisoDesc });
      setAvisoTitle('');
      setAvisoDesc('');
      setShowAvisoForm(false);
    }
  };

  const handleAddEvento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (eventoTitle && eventoDate && eventoLocation) {
      await addEvent({ 
        title: eventoTitle, 
        date: new Date(eventoDate).toISOString(), 
        location: eventoLocation, 
        description: eventoDesc 
      });
      setEventoTitle('');
      setEventoDate('');
      setEventoLocation('');
      setEventoDesc('');
      setShowEventoForm(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Resenha do Futebol</h2>
        <p className="text-sm text-gray-500">Mural de avisos, próximos eventos e estatísticas da galera.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Quadro de Avisos */}
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 overflow-hidden flex flex-col">
          <div className="border-b border-gray-200 bg-brand-dark px-4 py-4 sm:px-6 flex justify-between items-center">
            <h3 className="text-base font-semibold leading-6 text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-brand-gold" />
              Mural de Avisos
            </h3>
            {isAdmin && (
              <button onClick={() => setShowAvisoForm(!showAvisoForm)} className="text-white hover:text-brand-gold">
                <Plus className="h-5 w-5" />
              </button>
            )}
          </div>
          
          <div className="p-6 flex-1 overflow-y-auto max-h-[500px]">
            {showAvisoForm && isAdmin && (
              <form onSubmit={handleAddAviso} className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                <select value={avisoType} onChange={e => setAvisoType(e.target.value as any)} className="w-full rounded-md border-gray-300 text-sm">
                  <option value="info">Aviso Comum</option>
                  <option value="warning">Aviso Importante (Atenção)</option>
                </select>
                <input required type="text" placeholder="Título" value={avisoTitle} onChange={e => setAvisoTitle(e.target.value)} className="w-full rounded-md border-gray-300 text-sm" />
                <textarea required placeholder="Descrição" value={avisoDesc} onChange={e => setAvisoDesc(e.target.value)} className="w-full rounded-md border-gray-300 text-sm" rows={2} />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowAvisoForm(false)} className="text-xs text-gray-500">Cancelar</button>
                  <button type="submit" className="bg-brand-green text-white px-3 py-1 rounded text-xs font-semibold">Salvar</button>
                </div>
              </form>
            )}

            <ul className="space-y-4">
              {announcements.length === 0 ? (
                <li className="text-center text-gray-500 py-4 text-sm">Nenhum aviso no momento.</li>
              ) : (
                announcements.map((aviso) => (
                  <li key={aviso.id} className={`p-4 rounded-lg border relative group ${aviso.type === 'warning' ? 'bg-yellow-50 border-yellow-100' : 'bg-gray-50 border-gray-100'}`}>
                    <p className={`text-sm font-medium ${aviso.type === 'warning' ? 'text-yellow-800' : 'text-gray-800'}`}>
                      {aviso.type === 'warning' && '⚠️ '} {aviso.title}
                    </p>
                    <p className={`text-xs mt-1 ${aviso.type === 'warning' ? 'text-yellow-600' : 'text-gray-600'}`}>
                      {aviso.description}
                    </p>
                    {isAdmin && (
                      <button onClick={() => deleteAnnouncement(aviso.id)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        {/* Próximos Eventos */}
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 overflow-hidden flex flex-col">
          <div className="border-b border-gray-200 bg-brand-green px-4 py-4 sm:px-6 flex justify-between items-center">
            <h3 className="text-base font-semibold leading-6 text-white flex items-center gap-2">
              <Beer className="h-5 w-5 text-white" />
              Próximos Eventos
            </h3>
            {isAdmin && (
              <button onClick={() => setShowEventoForm(!showEventoForm)} className="text-white hover:text-green-200">
                <Plus className="h-5 w-5" />
              </button>
            )}
          </div>
          
          <div className="p-6 flex-1 overflow-y-auto max-h-[500px]">
             {showEventoForm && isAdmin && (
              <form onSubmit={handleAddEvento} className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                <input required type="text" placeholder="Nome do Evento (Ex: Churrasco)" value={eventoTitle} onChange={e => setEventoTitle(e.target.value)} className="w-full rounded-md border-gray-300 text-sm" />
                <input required type="datetime-local" value={eventoDate} onChange={e => setEventoDate(e.target.value)} className="w-full rounded-md border-gray-300 text-sm" />
                <input required type="text" placeholder="Local" value={eventoLocation} onChange={e => setEventoLocation(e.target.value)} className="w-full rounded-md border-gray-300 text-sm" />
                <textarea placeholder="Detalhes (Opcional)" value={eventoDesc} onChange={e => setEventoDesc(e.target.value)} className="w-full rounded-md border-gray-300 text-sm" rows={2} />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowEventoForm(false)} className="text-xs text-gray-500">Cancelar</button>
                  <button type="submit" className="bg-brand-green text-white px-3 py-1 rounded text-xs font-semibold">Salvar</button>
                </div>
              </form>
            )}

            <div className="space-y-6">
              {events.length === 0 ? (
                <div className="text-center text-gray-500 py-4 text-sm">Nenhum evento marcado.</div>
              ) : (
                events.map(evento => {
                  const dataEvento = parseISO(evento.date);
                  return (
                    <div key={evento.id} className="flex items-start gap-4 relative group">
                      <div className="flex-shrink-0 w-14 text-center rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
                        <div className="bg-red-600 text-white text-xs font-bold py-1 uppercase">{format(dataEvento, 'MMM', { locale: ptBR })}</div>
                        <div className="text-xl font-bold text-gray-900 py-1">{format(dataEvento, 'dd')}</div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-md font-bold text-gray-900">{evento.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">📍 {evento.location} • ⏰ {format(dataEvento, 'HH:mm')}</p>
                        {evento.description && <p className="text-sm text-gray-600 mt-1">{evento.description}</p>}
                      </div>
                      {isAdmin && (
                        <button onClick={() => deleteEvent(evento.id)} className="absolute top-0 right-0 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Estatísticas Divertidas (Mantidas estáticas por enquanto) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 overflow-hidden">
          <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-brand-gold" />
              Estatísticas da Turma
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500 font-medium mb-1">Mais presenças no ano</div>
              <div className="text-lg font-bold text-gray-900">Carlos "Paredão"</div>
              <div className="text-xs text-brand-green font-semibold mt-1">42 jogos</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500 font-medium mb-1">Maior artilheiro</div>
              <div className="text-lg font-bold text-gray-900">Rodrigo "Matador"</div>
              <div className="text-xs text-brand-green font-semibold mt-1">35 gols</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500 font-medium mb-1">Pé de Pano (Mais atrasado)</div>
              <div className="text-lg font-bold text-gray-900">Marcos</div>
              <div className="text-xs text-red-500 font-semibold mt-1">10 atrasos</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
