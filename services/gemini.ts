
import { GoogleGenAI, Type } from "@google/genai";

export async function askGeminiExpert(prompt: string, context: string = "") {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === 'undefined') {
    console.warn("[IA Assistant] API_KEY no detectada. El asistente responderá en modo simulado.");
    return "Modo Seguro Activo: No hay conexión con el núcleo de IA. Por favor, configure la clave de sistema en el panel de control.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Contexto: ${context}\n\nPregunta: ${prompt}`,
      config: {
        systemInstruction: "Eres el Osart System Pilot. Responde de forma técnica y profesional sobre ingeniería electrónica.",
        temperature: 0.3,
      }
    });
    return response.text || "Error de flujo en el modelo de lenguaje.";
  } catch (error) {
    console.error("Gemini Failure:", error);
    return "Fallo crítico en el enlace neuronal de IA.";
  }
}

export async function auditSystemSecurity(systemState: string) {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === 'undefined') {
    return { score: 100, vulnerabilities: ["Modo Offline"], recommendations: ["Configurar API_KEY"] };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Audit state: ${systemState}`,
      config: {
        systemInstruction: "Genera una auditoría de seguridad en formato JSON.",
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
    return { score: 0, vulnerabilities: ["Error en auditoría"], recommendations: ["Revisar logs"] };
  }
}
