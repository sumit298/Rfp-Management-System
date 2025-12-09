import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const parseNaturalLanguageRFP = async (input) => {
  // Mock response for testing
  const prompt = `Parse this RFP request into structured JSON format:
"${input}"

Return ONLY valid JSON in this exact format:
{
  "title": "brief title",
  "description": "brief description",
  "requirements": {
    "items": [{"name": "item name", "quantity": number, "specs": "specifications"}],
    "budget": number,
    "deliveryDays": number,
    "paymentTerms": "terms",
    "warranty": "warranty period"
  }
}`;
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  const response = result.text;
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  return JSON.parse(jsonMatch[0]);
};

export const parseVendorProposal = async (emailContent, rfpRequirements) => {
  const prompt = `Parse this vendor proposal email into structured JSON:
"${emailContent}"

RFP Requirements: ${JSON.stringify(rfpRequirements)}

Return ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "pricing": {
    "items": [{"name": "item", "unitPrice": number, "quantity": number, "total": number}],
    "totalCost": number
  },
  "terms": {
    "deliveryDays": number,
    "paymentTerms": "terms",
    "warranty": "warranty"
  }
}`;

  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  
  let response = result.text.trim();
  
  // Remove markdown code blocks if present
  response = response.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  
  // Extract JSON object
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No valid JSON found in AI response');
  }
  
  try {
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Failed to parse AI response:', jsonMatch[0]);
    throw new Error('Invalid JSON from AI: ' + error.message);
  }
};

export const compareProposals = async (proposals, rfpRequirements) => {
  const prompt = `Analyze these proposals and score them (0-100):
RFP Requirements: ${JSON.stringify(rfpRequirements)}
Proposals: ${JSON.stringify(
    proposals.map((p) => ({
      id: p._id,
      vendor: p.vendorId?.name,
      pricing: p.pricing,
      terms: p.terms,
    }))
  )}

Return ONLY valid JSON in this format:
{
  "scoredProposals": [{"proposalId": "id", "aiScore": number, "aiSummary": "brief summary"}],
  "recommendation": {"vendorId": "id", "vendorName": "name", "reasoning": "why this is best"}
}`;

  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  const response = result.text;
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  return JSON.parse(jsonMatch[0]);
};
