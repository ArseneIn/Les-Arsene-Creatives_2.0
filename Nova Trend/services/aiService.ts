
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Technical Specification Discovery Engine
 */
export async function suggestTechnicalSpecs(name: string, brand: string, category: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `You are a technical product auditor for Nova Trend. 
    Analyze the following asset: Name: "${name}", Brand: "${brand}", Category: "${category}". 
    Return a list of its standard industry specifications as key-value pairs.
    
    Format requirements for keys:
    - If category is 'Laptops', keys must include: memory, cpu_brand, cpu_model, storage, display_size, display_panel, display_resolution, display_refresh_rate, battery_life, weight_lbs.
    - If 'E-Bikes', keys must include: motor_power, battery_capacity, top_speed, range, bike_weight.
    - For other categories, provide 6-8 relevant technical keys.
    - Use technical, accurate values based on known hardware data.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            specs: {
              type: Type.ARRAY,
              description: "A list of technical specification objects",
              items: {
                type: Type.OBJECT,
                properties: {
                  key: { 
                    type: Type.STRING, 
                    description: "The technical attribute name (e.g. 'memory', 'motor_power', 'display_size')" 
                  },
                  value: { 
                    type: Type.STRING, 
                    description: "The specific technical value (e.g. '16GB', '750W', '14\"')" 
                  }
                },
                required: ["key", "value"]
              }
            }
          },
          required: ["specs"]
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    const specsObj: Record<string, string> = {};
    if (Array.isArray(data.specs)) {
      data.specs.forEach((item: any) => {
        if (item.key && item.value) {
          specsObj[item.key] = item.value;
        }
      });
    }
    return Object.keys(specsObj).length > 0 ? specsObj : null;
  } catch (e) {
    console.error("AI Spec Parsing Error", e);
    return null;
  }
}

/**
 * Narrative Architecture Engine
 */
export async function generateNarrative(name: string, brand: string, specs: any) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const specStr = JSON.stringify(specs);
  const prompt = `You are a senior hardware copywriter at Nova Trend in Kigali, Rwanda. 
    Write a high-conversion, professional 3-4 sentence description for the asset: "${name}" by "${brand}".
    Use these technical parameters for accuracy: ${specStr}.
    Tone: Elite, authoritative, and technically dense. 
    Highlight suitability for the Rwandan professional landscape (e.g., durability, reliability in Kigali environments).
    DO NOT use flowery emojis. Use clinical, persuasive language.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text?.trim() || "";
  } catch (e) {
    console.error("AI Narrative Error", e);
    return "";
  }
}

/**
 * Market Value Validation Engine
 */
export async function validateMarketPrice(name: string, price: number, condition: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Perform a market audit for: "${name}" in "${condition}" condition. 
    Is a price of $${price} reasonable based on global trends and regional availability in East Africa? 
    Return a brief technical flag (e.g. "Optimal", "Low Trace", "Premium Bias") and a 1-sentence justification.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            flag: { type: Type.STRING, description: "Short assessment status" },
            reason: { type: Type.STRING, description: "Technical justification" }
          },
          required: ["flag", "reason"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("AI Price Audit Error", e);
    return { flag: "Unknown", reason: "Registry sync failed." };
  }
}
