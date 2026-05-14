import { create } from 'zustand';
import type { Player, Match, Transaction, MonthlyPayment, User } from '../types';
import { supabase } from '../lib/supabase';

// Mock Data Initializer
const generateMockMensalistas = (): Player[] => {
  return Array.from({ length: 18 }).map((_, i) => ({
    id: `m-${i + 1}`,
    name: `Jogador Mensalista ${i + 1}`,
    nickname: `Apelido ${i + 1}`,
    phone: `(11) 99999-00${i.toString().padStart(2, '0')}`,
    position: ['Goleiro', 'Zagueiro', 'Meia', 'Atacante'][i % 4],
    status: 'mensalista',
    joinDate: new Date(2023, 0, 1).toISOString(),
    photoUrl: `https://ui-avatars.com/api/?name=J+${i + 1}&background=1a472a&color=fff`,
  }));
};

interface AppState {
  user: User | null;
  players: Player[];
  matches: Match[];
  transactions: Transaction[];
  monthlyPayments: MonthlyPayment[];
  
  // Auth Actions
  setUser: (user: User | null) => void;
  fetchData: () => Promise<void>;
  
  // Actions
  addPlayer: (player: Omit<Player, 'id' | 'joinDate'>) => Promise<void>;
  updatePlayer: (player: Player) => void;
  deletePlayer: (id: string) => void;
  
  addMatch: (match: Omit<Match, 'id'>) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateMonthlyPayment: (payment: MonthlyPayment) => void;
}

export const useStore = create<AppState>((set, get) => ({
      user: null,
      players: [],
      matches: [],
      transactions: [],
      monthlyPayments: [],

      setUser: (user) => set({ user }),

      fetchData: async () => {
        const [playersRes, matchesRes, transactionsRes] = await Promise.all([
          supabase.from('players').select('*').order('name'),
          supabase.from('matches').select('*').order('date', { ascending: false }),
          supabase.from('transactions').select('*').order('date', { ascending: false })
        ]);
        
        if (playersRes.data) set({ players: playersRes.data as Player[] });
        if (matchesRes.data) set({ matches: matchesRes.data as Match[] });
        if (transactionsRes.data) set({ transactions: transactionsRes.data as Transaction[] });
      },

      addPlayer: async (playerData) => {
        const { data, error } = await supabase
          .from('players')
          .insert([playerData])
          .select()
          .single();
          
        if (!error && data) {
          set((state) => ({ players: [...state.players, data as Player] }));
        }
      },
      updatePlayer: async (player) => {
        const { error } = await supabase.from('players').update(player).eq('id', player.id);
        if (!error) {
          set((state) => ({ players: state.players.map(p => p.id === player.id ? player : p) }));
        }
      },
      deletePlayer: async (id) => {
        const { error } = await supabase.from('players').delete().eq('id', id);
        if (!error) {
          set((state) => ({ players: state.players.filter(p => p.id !== id) }));
        }
      },

      addMatch: async (matchData) => {
        const { data, error } = await supabase.from('matches').insert([matchData]).select().single();
        if (!error && data) {
          set((state) => ({ matches: [data as Match, ...state.matches] }));
        }
      },
      addTransaction: async (transactionData) => {
        const { data, error } = await supabase.from('transactions').insert([transactionData]).select().single();
        if (!error && data) {
          set((state) => ({ transactions: [data as Transaction, ...state.transactions] }));
        }
      },
      updateMonthlyPayment: (payment) => set((state) => {
        const existing = state.monthlyPayments.find(p => p.id === payment.id);
        if (existing) {
          return {
            monthlyPayments: state.monthlyPayments.map(p => p.id === payment.id ? payment : p)
          };
        }
        return { monthlyPayments: [...state.monthlyPayments, payment] };
      })
}));
