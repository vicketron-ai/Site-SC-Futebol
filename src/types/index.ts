export type PlayerStatus = 'mensalista' | 'avulso';

export interface Player {
  id: string;
  name: string;
  nickname: string;
  phone: string;
  photoUrl?: string;
  position: string;
  status: PlayerStatus;
  joinDate: string;
  notes?: string;
}

export interface Match {
  id: string;
  date: string;
  location: string;
  time: string;
  fee: number;
  participants: string[]; // array of player ids (both mensalistas and avulsos)
}

export type TransactionType = 'entrada' | 'saida';
export type TransactionCategory = 
  | 'mensalidade' 
  | 'pagamento_avulso' 
  | 'outras_receitas'
  | 'aluguel_campo'
  | 'churrasco'
  | 'bebidas'
  | 'uniformes'
  | 'bolas'
  | 'arbitragem'
  | 'eventos'
  | 'outras_despesas';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  date: string;
  description: string;
  playerId?: string; // Optional: linked to a specific player
  matchId?: string; // Optional: linked to a specific match
}

export interface MonthlyPayment {
  id: string;
  playerId: string;
  month: string; // YYYY-MM
  amount: number;
  paid: boolean;
  dueDate: string;
  paymentDate?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'player';
}

export interface Announcement {
  id: string;
  type: 'warning' | 'info';
  title: string;
  description: string;
  created_at?: string;
}

export interface Event {
  id: string;
  date: string;
  title: string;
  location: string;
  description?: string;
  created_at?: string;
}
