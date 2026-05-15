import { create } from 'zustand';
import type { Player, Match, Transaction, MonthlyPayment, User, Announcement, Event } from '../types';
import { supabase } from '../lib/supabase';



interface AppState {
  user: User | null;
  players: Player[];
  matches: Match[];
  transactions: Transaction[];
  monthlyPayments: MonthlyPayment[];
  announcements: Announcement[];
  events: Event[];
  
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

  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'created_at'>) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  addEvent: (event: Omit<Event, 'id' | 'created_at'>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}

export const useStore = create<AppState>((set) => ({
      user: null,
      players: [],
      matches: [],
      transactions: [],
      monthlyPayments: [],
      announcements: [],
      events: [],

      setUser: (user) => set({ user }),

      fetchData: async () => {
        const [playersRes, matchesRes, transactionsRes, announcementsRes, eventsRes] = await Promise.all([
          supabase.from('players').select('*').order('name'),
          supabase.from('matches').select('*').order('date', { ascending: false }),
          supabase.from('transactions').select('*').order('date', { ascending: false }),
          supabase.from('announcements').select('*').order('created_at', { ascending: false }),
          supabase.from('events').select('*').order('date', { ascending: true })
        ]);
        
        if (playersRes.data) set({ players: playersRes.data as Player[] });
        if (matchesRes.data) set({ matches: matchesRes.data as Match[] });
        if (transactionsRes.data) set({ transactions: transactionsRes.data as Transaction[] });
        if (announcementsRes.data) set({ announcements: announcementsRes.data as Announcement[] });
        if (eventsRes.data) set({ events: eventsRes.data as Event[] });
      },

      addPlayer: async (playerData) => {
        const { data, error } = await supabase
          .from('players')
          .insert([playerData])
          .select()
          .single();
          
        if (error) {
          console.error("ERRO AO ADD JOGADOR:", error);
          alert("Erro Supabase: " + error.message + " - Details: " + error.details);
          throw error;
        }
        if (data) {
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
        if (error) {
          console.error("ERRO AO ADD MATCH:", error);
          alert("Erro Supabase: " + error.message);
          throw error;
        }
        if (data) {
          set((state) => ({ matches: [data as Match, ...state.matches] }));
        }
      },
      addTransaction: async (transactionData) => {
        const { data, error } = await supabase.from('transactions').insert([transactionData]).select().single();
        if (error) {
          console.error("ERRO AO ADD TRANSACT:", error);
          alert("Erro Supabase: " + error.message);
          throw error;
        }
        if (data) {
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
      }),

      addAnnouncement: async (announcementData) => {
        const { data, error } = await supabase.from('announcements').insert([announcementData]).select().single();
        if (error) {
          console.error("ERRO AO ADD AVISO:", error);
          alert("Erro Supabase: " + error.message);
          throw error;
        }
        if (data) {
          set((state) => ({ announcements: [data as Announcement, ...state.announcements] }));
        }
      },
      deleteAnnouncement: async (id) => {
        const { error } = await supabase.from('announcements').delete().eq('id', id);
        if (!error) {
          set((state) => ({ announcements: state.announcements.filter(a => a.id !== id) }));
        }
      },
      addEvent: async (eventData) => {
        const { data, error } = await supabase.from('events').insert([eventData]).select().single();
        if (error) {
          console.error("ERRO AO ADD EVENTO:", error);
          alert("Erro Supabase: " + error.message);
          throw error;
        }
        if (data) {
          set((state) => ({ 
            events: [...state.events, data as Event].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) 
          }));
        }
      },
      deleteEvent: async (id) => {
        const { error } = await supabase.from('events').delete().eq('id', id);
        if (!error) {
          set((state) => ({ events: state.events.filter(e => e.id !== id) }));
        }
      }
}));
