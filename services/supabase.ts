
import { createClient } from '@supabase/supabase-js';
import { ActivityLog, User as UserType } from '../types';

// En fase de pruebas, estas variables pueden estar vacías. 
// Usamos el operador de cortocircuito para evitar pasar strings vacíos al constructor.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Cliente de Supabase seguro para entornos de prueba.
 * Si las credenciales no son URLs válidas, el cliente se mantiene nulo para evitar crashes.
 */
export const supabase = (supabaseUrl && supabaseUrl.startsWith('http')) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

/**
 * Sincroniza el perfil del usuario y sus puntos XP de forma segura.
 */
export const syncUserProfile = async (user: UserType) => {
  if (!supabase) {
    console.warn("[Osart Sync] Supabase no configurado. El perfil se mantiene en sesión local.");
    return null;
  }
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

/**
 * Registra una acción en el historial de actividad (Ledger) solo si la conexión está activa.
 */
export const recordActivity = async (log: ActivityLog) => {
  if (!supabase) {
    console.debug("[Osart Ledger] Actividad local registrada:", log.action);
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

/**
 * Actualiza los puntos XP tras un juego exitoso con manejo de errores.
 */
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
