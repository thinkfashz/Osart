
import { createClient } from '@supabase/supabase-js';
import { ActivityLog, User as UserType } from '../types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * El cliente solo se instancia si las variables existen y son válidas.
 * Durante el build de Vercel, estas variables suelen ser undefined.
 */
const isClientConfigured = supabaseUrl && supabaseKey && supabaseUrl !== 'undefined' && supabaseKey !== 'undefined';

export const supabase = isClientConfigured 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

if (!supabase) {
  if (typeof window !== 'undefined') {
    console.warn("[Osart Kernel] Supabase desconectado. Operando en modo de persistencia efímera (Local Only).");
  }
}

export const syncUserProfile = async (user: UserType) => {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        email: user.email,
        name: user.name,
        xp: user.learningPoints,
        last_login: new Date().toISOString()
      }, { onConflict: 'email' });
    
    if (error) throw error;
    return data;
  } catch (e) {
    return null;
  }
};

export const recordActivity = async (log: ActivityLog) => {
  if (!supabase) {
    // En lugar de error, logeamos en consola para debugging en desarrollo
    if (typeof window !== 'undefined') {
      console.debug(`[Local Ledger] ${log.action}: ${log.details}`);
    }
    return;
  }
  try {
    await supabase.from('activity_logs').insert([{
      user_email: log.userId,
      action: log.action,
      category: log.category,
      details: log.details,
      timestamp: log.timestamp
    }]);
  } catch (e) {
    // Silencio en producción/desarrollo para no interrumpir UX
  }
};

export const updateUserXP = async (email: string, pointsToAdd: number) => {
  if (!supabase) return null;
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('xp')
      .eq('email', email)
      .single();

    const newXP = (profile?.xp || 0) + pointsToAdd;
    await supabase.from('profiles').update({ xp: newXP }).eq('email', email);
    return newXP;
  } catch (e) {
    return null;
  }
};
