import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy GoogleGenAI initialization
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// System instruction for Pharmacy AI Engine
const SYSTEM_INSTRUCTION = `You are Pharmix AI, an expert Clinical Pharmacist and Supply Chain Analytics Specialist. 
You provide precise, evidence-based recommendations for pharmacy inventory optimization, demand forecasting, 
expiry risk mitigation, and pharmacological safety guidance. Be professional, structured, and practical.`;

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Auth simulation
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  // Simulated token & user response
  const role = email.includes("admin") ? "admin" : email.includes("pharm") ? "pharmacist" : "staff";
  res.json({
    token: `jwt_simulated_token_${Date.now()}`,
    user: {
      id: `usr_${Date.now()}`,
      name: email.split("@")[0].toUpperCase(),
      email,
      role,
      status: "active",
      createdAt: new Date().toISOString()
    }
  });
});

// AI Endpoint: Predict Medicine Demand
app.post("/api/ai/predict-demand", async (req, res) => {
  try {
    const { medicines, recentSales } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback response when key is not set
      return res.json({
        type: 'demand_prediction',
        title: 'AI Demand Prediction (Simulated Mode)',
        summary: 'Based on seasonal trends and recent sales velocity, antibiotics and diabetes medications show an expected 18% demand spike over the next 30 days.',
        detailsMarkdown: `### 📈 Demand Forecast Analysis
- **Antibiotics (e.g. Amoxicillin)**: Expected +22% surge due to seasonal respiratory infections.
- **Diabetes Care (e.g. Metformin, Insulin)**: Steady high consumption rate (~15 units/week). High stockout risk within 10 days if unreplenished.
- **Pain Relievers**: Normal baseline consumption.

#### Recommended Actions:
1. Increase Amoxicillin buffer stock by 40 units.
2. Expedite Metformin purchase order immediately.`,
        confidenceScore: 0.92,
        timestamp: new Date().toISOString()
      });
    }

    const prompt = `Analyze the following inventory and sales data for a pharmacy:
Medicines: ${JSON.stringify(medicines || [])}
Recent Sales: ${JSON.stringify(recentSales || [])}

Predict the demand surge, high-velocity medicines, and seasonal trends for the next 30 days.
Return a structured JSON with properties:
- title (string)
- summary (string)
- detailsMarkdown (markdown string with insights and actionable advice)
- confidenceScore (number 0-1)
- items (array of { medicineName: string, expectedDemandSurgePercent: number, riskLevel: "high"|"medium"|"low", reasoning: string })`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({
      type: 'demand_prediction',
      title: parsed.title || 'AI Demand Forecast',
      summary: parsed.summary || 'AI demand prediction generated successfully.',
      detailsMarkdown: parsed.detailsMarkdown || '',
      items: parsed.items || [],
      confidenceScore: parsed.confidenceScore || 0.88,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("Demand prediction AI error:", error);
    res.status(500).json({ error: error.message || "Failed to generate demand prediction" });
  }
});

// AI Endpoint: Smart Inventory Reorder Suggestions
app.post("/api/ai/reorder-suggestions", async (req, res) => {
  try {
    const { lowStockMedicines, suppliers } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        type: 'reorder_suggestion',
        title: 'Smart Reorder Suggestions',
        summary: 'AI identified 2 critical low-stock items requiring immediate reorder.',
        detailsMarkdown: `### 📦 Reorder Recommendations
- **Omeprazole 20mg**: Current Stock: 6 units | Min Threshold: 20 units. Suggested Order: 100 units from **Apex Bio-Tech Inc**.
- **Metformin 850mg**: Current Stock: 12 units | Min Threshold: 25 units. Suggested Order: 150 units from **Apex Bio-Tech Inc**.`,
        items: [
          {
            medicineId: 'med_5',
            medicineName: 'Omeprazole 20mg Delayed Release',
            suggestedQuantity: 100,
            urgency: 'high',
            reasoning: 'Critical low stock (6 units remaining). Stockout projected in 2 days.'
          },
          {
            medicineId: 'med_2',
            medicineName: 'Metformin 850mg',
            suggestedQuantity: 150,
            urgency: 'high',
            reasoning: 'Stock level (12 units) below safety threshold. Steady diabetic patient demand.'
          }
        ],
        confidenceScore: 0.95,
        timestamp: new Date().toISOString()
      });
    }

    const prompt = `Given these low-stock medicines: ${JSON.stringify(lowStockMedicines || [])}
and available suppliers: ${JSON.stringify(suppliers || [])}

Generate intelligent purchase order suggestions including optimal reorder quantities based on min thresholds and lead times.
Return a structured JSON with properties:
- title (string)
- summary (string)
- detailsMarkdown (markdown string)
- items (array of { medicineId: string, medicineName: string, suggestedQuantity: number, urgency: "high"|"medium"|"low", reasoning: string })
- confidenceScore (number 0-1)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({
      type: 'reorder_suggestion',
      title: parsed.title || 'Smart Reorder Suggestions',
      summary: parsed.summary || 'Reorder recommendations compiled.',
      detailsMarkdown: parsed.detailsMarkdown || '',
      items: parsed.items || [],
      confidenceScore: parsed.confidenceScore || 0.9,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("Reorder suggestion error:", error);
    res.status(500).json({ error: error.message || "Failed to generate reorder suggestions" });
  }
});

// AI Endpoint: Expiry Risk Prediction
app.post("/api/ai/expiry-risk", async (req, res) => {
  try {
    const { medicines } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        type: 'expiry_risk',
        title: 'Expiry Risk & Mitigation Strategy',
        summary: '1 batch already expired and 2 batches expiring within 60 days.',
        detailsMarkdown: `### ⏳ Expiry Audit & Action Plan
1. **Paracetamol 650mg (Batch BT-2024-P2)**: EXPIRED on June 15, 2026. **Action**: Immediate quarantine and removal from POS shelves according to FDA waste disposal protocols.
2. **Amoxicillin 500mg (Batch BT-2026-A2)**: Expires August 30, 2026 (35 units). **Action**: FEFO (First-Expired, First-Out) placement; consider 15% clearance discount for bulk clinic purchases.
3. **Insulin Glargine (Batch BT-2026-I1)**: Expires Sept 15, 2026 (28 units). **Action**: Ensure continuous refrigeration; notify recurring diabetic patients for routine refills.`,
        items: [
          {
            medicineName: 'Paracetamol 650mg (Batch BT-2024-P2)',
            daysUntilExpiry: -38,
            urgency: 'high',
            recommendedDiscount: 0,
            reasoning: 'Expired item must be quarantined and destroyed safely.'
          },
          {
            medicineName: 'Amoxicillin 500mg (Batch BT-2026-A2)',
            daysUntilExpiry: 38,
            urgency: 'high',
            recommendedDiscount: 15,
            reasoning: 'Expiring in ~38 days. Apply FEFO and 15% discount.'
          }
        ],
        confidenceScore: 0.94,
        timestamp: new Date().toISOString()
      });
    }

    const prompt = `Audit the following pharmacy stock for expiration risks:
Medicines with batches: ${JSON.stringify(medicines || [])}

Identify expired stock, near-expiry stock (within 90 days), financial loss exposure, and clear action strategies (FEFO, discounts, returns to supplier).
Return a structured JSON with properties:
- title (string)
- summary (string)
- detailsMarkdown (markdown string)
- items (array of { medicineName: string, daysUntilExpiry: number, urgency: "high"|"medium"|"low", recommendedDiscount: number, reasoning: string })
- confidenceScore (number 0-1)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({
      type: 'expiry_risk',
      title: parsed.title || 'Expiry Risk Analysis',
      summary: parsed.summary || 'Expiry risks analyzed.',
      detailsMarkdown: parsed.detailsMarkdown || '',
      items: parsed.items || [],
      confidenceScore: parsed.confidenceScore || 0.92,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("Expiry risk error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze expiry risk" });
  }
});

// AI Endpoint: Interactive Pharmacist & Inventory Assistant
app.post("/api/ai/chat-assistant", async (req, res) => {
  try {
    const { prompt, inventoryContext } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        reply: `**Pharmix Assistant (Offline Mode)**\n\nI can assist you with clinical and inventory queries. Your question was: "${prompt}".\n\n*Note*: To enable real-time Gemini AI insights, configure your \`GEMINI_API_KEY\` in Settings > Secrets.`
      });
    }

    const fullPrompt = `User Query: ${prompt}

Current Inventory Context (Summary):
${JSON.stringify(inventoryContext || {})}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: fullPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION
      }
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("AI Assistant error:", error);
    res.status(500).json({ error: error.message || "AI Assistant failed to respond" });
  }
});

// Vite / Static files middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
