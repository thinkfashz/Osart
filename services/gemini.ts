
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Helper para inicializar IA de forma segura.
 * Solo crea la instancia si existe una API_KEY válida.
 */
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === 'undefined') {
    console.warn("[Osart AI] API_KEY no configurada. Las funciones de IA retornarán respuestas de error controladas.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export async function askGeminiExpert(prompt: string, context: string = "") {
  const ai = getAIClient();
  if (!ai) return "Protocolo de IA fuera de línea. Verifique la API_KEY del sistema.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Consulta del cliente Osart: ${prompt}`,
      config: {
        systemInstruction: `Eres el System Pilot de Osart Elite, una plataforma premium de ingeniería electrónica. 
        Tus respuestas deben ser técnicas, precisas y enfocadas en la resolución de problemas de hardware. 
        Utiliza el siguiente contexto del catálogo para recomendar productos específicos si el usuario lo requiere: ${context}.
        Si no sabes algo técnico, admítelo y sugiere consultar los datasheets oficiales.`,
        temperature: 0.3,
      }
    });
    return response.text || "Protocolo de comunicación fallido. Reintente sincronización.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error en la Capa 2 (Razonamiento Crítico). El modelo no pudo procesar la solicitud.";
  }
}

export async function auditSystemSecurity(systemState: string) {
  const ai = getAIClient();
  if (!ai) return { score: 0, vulnerabilities: ["IA Offline"], recommendations: ["Configurar API_KEY"] };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Realiza un análisis de penetración y auditoría de código para el siguiente estado del sistema: ${systemState}`,
      config: {
        systemInstruction: `Eres un Auditor Senior de Ciberseguridad. Analiza el JSON del sistema y devuelve un reporte estructurado. 
        Detecta fugas de datos, debilidades en CORS, y riesgos en la conexión con la base de datos.
        Responde SIEMPRE en formato JSON válido.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "Puntaje de 0 a 100" },
            vulnerabilities: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            autoHealedIssues: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["score", "vulnerabilities", "recommendations"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Audit Error:", error);
    return { score: 0, vulnerabilities: ["Fallo en Auditoría"], recommendations: ["Revisar logs de servidor"] };
  }
}
