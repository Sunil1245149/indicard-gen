
import { GoogleGenAI, Type } from "@google/genai";
import { IdCardData } from "../types";

// Always use process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateIdentityData = async (prompt: string): Promise<Partial<IdCardData>> => {
  try {
    // Use gemini-3-flash-preview for basic text tasks
    const model = "gemini-3-flash-preview";
    const userPrompt = `Generate a fictional Indian farmer (Kisan) identity profile based on this description: "${prompt}". 
    Provide the data in JSON format suitable for a Farmer ID card. 
    
    CRITICAL: You must generate specific agricultural land details (District, Taluka, Village, Gat Number, Area).
    
    Include fields: 
    - name
    - hindiName (transliterated to Hindi)
    - fatherName
    - dob (DD/MM/YYYY)
    - gender
    - idNumber (12 digit Aadhaar style or KCC format)
    - address (Short address like "At [Village] Post [Post]")
    - phone
    - district (Real district in India relevant to context)
    - taluka (Sub-district)
    - village
    - gatNumber (Survey number, e.g., "34" or "102/A")
    - area (in Hectares, e.g., "0.81")
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: userPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            hindiName: { type: Type.STRING },
            fatherName: { type: Type.STRING },
            dob: { type: Type.STRING },
            gender: { type: Type.STRING, enum: ["Male", "Female", "Other"] },
            idNumber: { type: Type.STRING },
            address: { type: Type.STRING },
            phone: { type: Type.STRING },
            district: { type: Type.STRING },
            taluka: { type: Type.STRING },
            village: { type: Type.STRING },
            gatNumber: { type: Type.STRING },
            area: { type: Type.STRING },
          },
          required: ["name", "district", "taluka", "village", "gatNumber", "area"],
        },
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return {
        ...data,
        header: "KISAN IDENTITY CARD",
        subHeader: "Private Farmer Profile",
        issueDate: new Date().toISOString().split('T')[0],
      };
    }
    throw new Error("No data received from Gemini");
  } catch (error) {
    console.error("Error generating identity:", error);
    throw error;
  }
};
