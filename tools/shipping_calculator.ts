
/**
 * Herramienta de Cálculo de Envío (Protocolo B.L.A.S.T - Capa 3)
 * Realiza cálculos deterministas basados en zona y peso.
 */
export const calculateShipping = (region: string, itemsCount: number): number => {
  const baseRate = 3500;
  const regionRates: Record<string, number> = {
    'Metropolitana': 0,
    'Valparaíso': 1500,
    'Biobío': 2500,
    'Antofagasta': 4500,
    'Magallanes': 6500
  };

  const extraPerItem = 500;
  const regionExtra = regionRates[region] || 3000;
  
  return baseRate + regionExtra + (itemsCount * extraPerItem);
};
