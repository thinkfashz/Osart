
import { createClient } from '@supabase/supabase-js';
import { ActivityLog, User as UserType } from '../types';

// Obtenemos las variables de entorno de Next.js
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Validación de URL para evitar el error 'supabaseUrl is required'.
 * Solo inicializa el cliente si la URL es una cadena válida que empieza con http.
 */
const isValidUrl = (url?: string) => {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Cliente de Supabase exportado de forma segura.
 * Si las credenciales no son válidas, se exporta null y el resto de la app
 * maneja esta ausencia de forma silenciosa (Modo Simulación).
 */
export const supabase = (isValidUrl(supabaseUrl) && supabaseKey) 
  ? createClient(supabaseUrl as string, supabaseKey as string) 
  : null;

if (!supabase) {
  console.warn("[Osart Systems] Supabase no detectado o URL inválida. Iniciando en Modo Simulación Local.");
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
    console.error("Error sincronizando perfil:", e);
    return null;
  }
};

export const recordActivity = async (log: ActivityLog) => {
  if (!supabase) {
    console.debug(`[Ledger Local] ${log.action}: ${log.details}`);
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
    console.error("Error en Ledger remoto:", e);
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
    console.error("Error actualizando XP:", e);
    return null;
  }
};
