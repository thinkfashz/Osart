
import { createClient } from '@supabase/supabase-js';
import { ActivityLog, User as UserType } from '../types';

/**
 * Los valores de entorno de Next.js se inyectan en tiempo de ejecución.
 * Durante el build o en entornos locales sin .env, estos valores serán undefined.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Función de validación robusta para asegurar que el cliente de Supabase
 * solo se inicialice con parámetros válidos.
 */
const getSupabaseClient = () => {
  if (!supabaseUrl || !supabaseKey || supabaseUrl === 'undefined' || supabaseKey === 'undefined') {
    return null;
  }
  try {
    // Validamos que sea una URL válida para evitar el crash del constructor
    new URL(supabaseUrl);
    return createClient(supabaseUrl, supabaseKey);
  } catch (e) {
    return null;
  }
};

export const supabase = getSupabaseClient();

if (!supabase) {
  console.warn("[Osart Systems] Supabase no inicializado. El sistema operará en 'Modo Local' sin persistencia remota.");
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
    console.error("Error en sincronización de perfil:", e);
    return null;
  }
};

export const recordActivity = async (log: ActivityLog) => {
  if (!supabase) {
    console.debug(`[Ledger Local] Actividad: ${log.action} - ${log.details}`);
    return;
  }
  try {
    const { error } = await supabase
      .from('activity_logs')
      .insert([{
        user_email: log.userId,
        action: log.action,
        category: log.category,
        details: log.details,
        timestamp: log.timestamp
      }]);
    if (error) throw error;
  } catch (e) {
    console.error("Error en registro de Ledger:", e);
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

    await supabase
      .from('profiles')
      .update({ xp: newXP })
      .eq('email', email);
      
    return newXP;
  } catch (e) {
    console.error("Error al actualizar XP:", e);
    return null;
  }
};
