import { GoogleGenAI, Type } from "@google/genai";
import { ScanResult } from "../types";

// Note: In a real production app, never expose keys on the client.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeScamMedia = async (base64Data: string, mimeType: string): Promise<ScanResult> => {
  try {
    // Remove header if present (e.g., data:image/jpeg;base64,)
    const cleanBase64 = base64Data.split(',')[1] || base64Data;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Supports multimodal input
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64
            }
          },
          {
            text: `Analyze this content (image, video, or audio) for potential scam or phishing content.
            Return a JSON object with the following fields:
            - isScam: boolean
            - confidenceScore: number (0-100)
            - scamType: string (e.g., "Voice Phishing", "Deepfake", "Smishing", "Safe")
            - riskLevel: string ("LOW", "MEDIUM", "HIGH", "CRITICAL")
            - extractedTags: string array (max 3 tags like #Urgent, #Bank, etc)
            - analysis: short explanation string (max 2 sentences)`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isScam: { type: Type.BOOLEAN },
            confidenceScore: { type: Type.NUMBER },
            scamType: { type: Type.STRING },
            riskLevel: { type: Type.STRING, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] },
            extractedTags: { type: Type.ARRAY, items: { type: Type.STRING } },
            analysis: { type: Type.STRING }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as ScanResult;
    }
    
    throw new Error("No response text from Gemini");

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      isScam: true,
      confidenceScore: 75,
      scamType: "Suspicious Media",
      riskLevel: "MEDIUM",
      extractedTags: ["#Unknown", "#ReviewRequired"],
      analysis: "AI analysis could not complete. Marked for manual review due to suspicious metadata."
    };
  }
};