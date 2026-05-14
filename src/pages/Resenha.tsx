import React from 'react';
import { MessageSquare, Calendar, Trophy, Beer } from 'lucide-react';

export function Resenha() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Resenha do Futebol</h2>
        <p className="text-sm text-gray-500">Mural de avisos, próximos eventos e estatísticas da galera.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Quadro de Avisos */}
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 overflow-hidden">
          <div className="border-b border-gray-200 bg-brand-dark px-4 py-4 sm:px-6">
            <h3 className="text-base font-semibold leading-6 text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-brand-gold" />
              Mural de Avisos
            </h3>
          </div>
          <div className="p-6">
            <ul className="space-y-4">
              <li className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                <p className="text-sm text-yellow-800 font-medium">⚠️ Pessoal, mensalidade vence no dia 10!</p>
                <p className="text-xs text-yellow-600 mt-1">Evitem atrasos para não comprometer o aluguel do campo.</p>
              </li>
              <li className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-800 font-medium">Novo uniforme chega semana que vem.</p>
                <p className="text-xs text-gray-600 mt-1">Quem já pagou a sua parte, retirar com o tesoureiro no domingo.</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Próximos Eventos */}
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 overflow-hidden">
          <div className="border-b border-gray-200 bg-brand-green px-4 py-4 sm:px-6">
            <h3 className="text-base font-semibold leading-6 text-white flex items-center gap-2">
              <Beer className="h-5 w-5 text-white" />
              Próximos Eventos
            </h3>
          </div>
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-14 text-center rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
                <div className="bg-red-600 text-white text-xs font-bold py-1 uppercase">Dez</div>
                <div className="text-xl font-bold text-gray-900 py-1">20</div>
              </div>
              <div>
                <h4 className="text-md font-bold text-gray-900">Churrasco de Fim de Ano</h4>
                <p className="text-sm text-gray-500 mt-1">Chácara do João. Levar o que for beber e 1kg de carne.</p>
                <button className="mt-3 text-sm text-brand-green font-semibold hover:text-brand-green/80 transition-colors">
                  Confirmar presença &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Estatísticas Divertidas */}
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
