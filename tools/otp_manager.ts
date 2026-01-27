
/**
 * Herramienta de Gestión OTP (Protocolo B.L.A.S.T - Capa 3)
 * Maneja la generación y validación de códigos de seguridad.
 */

// En un entorno real, esto se conectaría con Twilio o SendGrid.
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const simulateSendOTP = async (target: string, code: string): Promise<boolean> => {
  console.log(`[B.L.A.S.T. Layer 3] Enviando OTP ${code} a ${target}`);
  // Simulamos latencia de red
  await new Promise(resolve => setTimeout(resolve, 1500));
  return true;
};

export const validateOTP = (input: string, correctCode: string): boolean => {
  return input === correctCode;
};
