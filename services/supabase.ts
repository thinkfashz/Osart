
/**
 * Integración Real con Supabase
 * Para habilitar, añade NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en Vercel.
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@^2.39.0';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const saveOrder = async (order: any) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([order]);
    if (error) throw error;
    return { data, success: true };
  } catch (e) {
    console.error("Error persistencia Supabase:", e);
    return { success: false, error: e };
  }
};
