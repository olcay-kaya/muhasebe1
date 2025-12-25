
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIAssistantResponse = async (userMessage: string, history: {role: string, parts: any[]}[]) => {
  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: [
      ...history,
      { role: 'user', parts: [{ text: userMessage }] }
    ],
    config: {
      systemInstruction: "Sen 'NOTA-MUHASEBE-ASİSTANI' uygulamasının sevimli asistanısın. Uzmanlık alanın Türk muhasebe ve vergi mevzuatıdır. Kullanıcılara nazikçe yardımcı ol, güncel gelişmeleri öner ve teknik soruları basitleştirerek açıkla. Yanıtlarını verirken profesyonel ama arkadaş canlısı bir ton kullan.",
      tools: [{ googleSearch: {} }]
    }
  });

  return {
    text: response.text || "Üzgünüm, şu an yanıt veremiyorum.",
    grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const generateTimeboardPlan = async (topic: string) => {
  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text: `Konu: ${topic}. Bu konuyla ilgili bir muhasebeci için haftalık çalışma planı ve toplantı önerileri oluştur. JSON formatında 'title', 'date' (YYYY-MM-DD), 'type' (Seminar/Meeting/Plan) ve 'description' alanlarını içeren bir dizi döndür.` }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            date: { type: Type.STRING },
            type: { type: Type.STRING },
            description: { type: Type.STRING }
          },
          required: ["title", "date", "type"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Plan parse error", e);
    return [];
  }
};
