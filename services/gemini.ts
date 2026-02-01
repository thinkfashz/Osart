
import { GoogleGenAI, Type } from "@google/genai";

/**
 * El API KEY debe ser accedido exclusivamente desde process.env.API_KEY.
 */
export async function askGeminiExpert(prompt: string, context: string = "") {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return "Protocolo de IA fuera de línea. Configure la API_KEY del sistema.";

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Consulta del cliente de Osart Elite: ${prompt}`,
      config: {
        systemInstruction: `Eres el System Pilot de Osart Elite, experto en ingeniería electrónica.
        Responde de forma técnica y precisa. Contexto de productos: ${context}.`,
        temperature: 0.3,
      }
    });
    return response.text || "Error en el flujo de datos del modelo.";
  } catch (error) {
    console.error("Gemini Assistant Error:", error);
    return "Error en la Capa de Razonamiento de IA.";
  }
}

export async function auditSystemSecurity(systemState: string) {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return { score: 0, vulnerabilities: ["IA Offline"], recommendations: ["Configurar API_KEY"] };

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Audita este estado del sistema: ${systemState}`,
      config: {
        systemInstruction: "Eres un Auditor de Ciberseguridad. Devuelve un JSON con 'score', 'vulnerabilities' y 'recommendations'.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            vulnerabilities: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["score", "vulnerabilities", "recommendations"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Security Audit Error:", error);
    return { score: 0, vulnerabilities: ["Error en Auditoría"], recommendations: ["Revisar logs"] };
  }
}
