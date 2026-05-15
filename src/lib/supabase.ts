import { createClient } from '@supabase/supabase-js';

// Chaves públicas do Supabase (anon key é segura para uso no frontend)
const supabaseUrl = 'https://yqsadwacaukrmeeyjwqv.supabase.co';
const supabaseAnonKey = 'sb_publishable_IDzJNEeMKeVT6PyKLkahMQ_neTri6zr';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
