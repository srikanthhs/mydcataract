import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function getDiagnosticAssessment(structuredData: any, imageBase64?: string) {
  const modelName = "gemini-3-flash-preview"; // Using the latest recommended model
  
  let prompt = `
    Analyze the following eye test results for a patient:
    - Visual Acuity Left: ${structuredData.visualAcuityLeft}
    - Visual Acuity Right: ${structuredData.visualAcuityRight}
    - Contrast Sensitivity: ${structuredData.contrastScore}%
    - Amsler Grid Distortion: ${structuredData.amslerResult ? 'YES' : 'NO'}
    - Glare Testing Score: ${structuredData.glareScore || 'N/A'}
    - Lens Opacity Rating: ${structuredData.lensOpacity || 'N/A'}
  `;

  const parts: any[] = [{ text: prompt }];
  
  if (imageBase64) {
    prompt += `
      An image of the eye is also provided. 
      Please inspect the image for signs of lens clouding or opacities.
    `;
    
    // Strip the data:image/jpeg;base64, prefix if present
    const cleanBase64 = imageBase64.split(',')[1] || imageBase64;
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: cleanBase64
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts }
    });
    
    return response.text || "Unable to extract diagnosis from AI response.";
  } catch (error) {
    console.error("AI Diagnosis Error:", error);
    return "Unable to generate AI assessment at this time.";
  }
}
