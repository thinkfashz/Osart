import { GoogleGenAI } from "@google/genai";

export async function askGeminiExpert(prompt: string, context: string = "") {
  // Fixed: Initialize GoogleGenAI inside the function to ensure the most current API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      // Fixed: Switched to gemini-3-pro-preview for complex technical and engineering reasoning tasks
      model: 'gemini-3-pro-preview',
      contents: `Consulta del cliente Osart: ${prompt}`,
      config: {
        systemInstruction: `Eres el System Pilot de Osart Elite.
      Tu objetivo es proveer CONSEJOS TÉCNICOS PROFUNDOS de ingeniería electrónica y robótica.
      
      REGLAS DE RESPUESTA:
      1. Si preguntan por un componente, explica su funcionamiento a nivel físico/eléctrico (ej: hablar de la arquitectura RISC en microcontroladores).
      2. Siempre incluye un "Osart Engineer Tip" al final.
      3. Usa un tono de experto senior, determinista y seguro.
      4. Si el usuario pregunta por stock o precios, usa EXACTAMENTE los datos del contexto: ${context}.
      5. Si no sabes algo, remite al manual técnico del fabricante.
      
      FORMATO: Usa Markdown para mejorar la legibilidad.`,
        temperature: 0.5, // Lower temperature for technical determinism.
        topP: 0.9,
      }
    });
    
    // Correctly using the .text property as defined in the latest SDK
    return response.text || "Protocolo de comunicación fallido. Reiniciando enlace...";
  } catch (error) {
    console.error("Agent Error:", error);
    return "Error en la Capa 2 (Razonamiento). Por favor, contacte al soporte de Osart.";
  }
}
