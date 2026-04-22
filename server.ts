import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API Route for Gemini Advice
app.post("/api/eye-health-tips", async (req, res) => {
  const results = req.body;
  
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({ tips: "Stay hydrated and ensure regular eye checkups." });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
      A user just completed a home cataract screening. 
      Results:
      - Visual Acuity: Left Eye ${results.visualAcuity?.leftEye || 'Unknown'}, Right Eye ${results.visualAcuity?.rightEye || 'Unknown'}
      - Contrast Sensitivity Score: ${results.contrast?.score || 'Unknown'}%
      - Amsler Grid: ${results.amsler?.detectedDistortions ? 'Distortions detected' : 'No distortions detected'}
      
      Provide 2-3 brief, helpful, and reassuring eye health tips or recommendations for this user. 
      Be professional but empathetic. Remind them to consult an eye doctor.
      Keep it under 60 words.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    res.json({ tips: response.text });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ tips: "Consult an ophthalmologist for a comprehensive eye exam if you notice any changes in your vision." });
  }
});

async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

if (process.env.NODE_ENV !== "production") {
  setupVite();
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// Export for Vercel
export default app;

// Listen only if not in a serverless environment
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
