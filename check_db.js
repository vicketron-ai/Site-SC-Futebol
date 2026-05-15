import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yqsadwacaukrmeeyjwqv.supabase.co';
const supabaseAnonKey = 'sb_publishable_IDzJNEeMKeVT6PyKLkahMQ_neTri6zr';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log("Testing insert into players...");
  const { data, error } = await supabase.from('players').insert([{
    name: 'Teste Debug',
    nickname: 'Teste',
    position: 'Atacante',
    phone: '000',
    status: 'mensalista'
  }]).select();

  if (error) {
    console.error("ERRO PLAYERS:", error);
  } else {
    console.log("SUCESSO PLAYERS:", data);
    // cleanup
    await supabase.from('players').delete().eq('name', 'Teste Debug');
  }

  console.log("Testing insert into transactions...");
  const { data: tData, error: tError } = await supabase.from('transactions').insert([{
    type: 'entrada',
    category: 'mensalidade',
    amount: 10,
    date: new Date().toISOString(),
    description: 'Teste'
  }]).select();

  if (tError) {
    console.error("ERRO TRANSACTIONS:", tError);
  } else {
    console.log("SUCESSO TRANSACTIONS:", tData);
    await supabase.from('transactions').delete().eq('description', 'Teste');
  }
}

test();
