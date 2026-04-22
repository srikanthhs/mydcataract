import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Dedicated API for Eye Health Tips
app.post("/api/eye-health-tips", async (req, res) => {
  const results = req.body;
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.json({ tips: "Consult an ophthalmologist for a comprehensive eye exam." });

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Provide 2-3 brief, helpful, and reassuring eye health tips based on these results: ${JSON.stringify(results)}. Keep it under 50 words.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    res.json({ tips: response.text });
  } catch (error) {
    res.status(500).json({ tips: "Stay consistent with your eye care routine." });
  }
});

// Dedicated API for Diagnostic Assessment (Full AI Analysis)
app.post("/api/diagnostic-assessment", async (req, res) => {
  const { structuredData, imageBase64 } = req.body;
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Missing API Key");

    const ai = new GoogleGenAI({ apiKey });
    let prompt = `
      Analyze these eye test results:
      - Acuity: ${structuredData.visualAcuityLeft}/${structuredData.visualAcuityRight}
      - Contrast: ${structuredData.contrastScore}%
      - Amsler: ${structuredData.amslerResult ? 'Distortion' : 'Normal'}
      - Opacity Grade: ${structuredData.lensOpacity || 'N/A'}
    `;

    const parts: any[] = [{ text: prompt }];
    if (imageBase64) {
      const cleanBase64 = imageBase64.split(',')[1] || imageBase64;
      parts.push({ inlineData: { mimeType: "image/jpeg", data: cleanBase64 } });
      prompt += " Inspect the provided eye image for lens clouding or visible cataracts.";
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts }
    });
    res.json({ assessment: response.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ assessment: "Unable to process AI assessment. Please check connectivity." });
  }
});

// Production Handling
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  // Local Dev Handling
  const setupVite = async () => {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  };
  setupVite();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
