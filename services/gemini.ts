
import { GoogleGenAI } from "@google/genai";

// Always use the named parameter and direct access to process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function askGeminiExpert(prompt: string, context: string = "") {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Pregunta del cliente: ${prompt}`,
      config: {
        // Use systemInstruction for defining persona and static context.
        systemInstruction: `Eres un experto senior en electrónica y robótica de la tienda "Osart Elite". 
      Tu objetivo es ayudar a los clientes a encontrar componentes, explicar para qué sirven y dar consejos técnicos.
      Sé amable, profesional y usa un tono tecnológico.
      Contexto del catálogo: ${context}`,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      }
    });
    // response.text property directly returns the extracted string output.
    return response.text || "Lo siento, tuve un pequeño corto circuito mental. ¿Puedes repetir la pregunta?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Mi conexión con la base de datos central de Osart se ha interrumpido. Por favor intenta de nuevo en unos momentos.";
  }
}
