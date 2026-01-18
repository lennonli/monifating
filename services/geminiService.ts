import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Generic function to generate legal content based on a prompt
export const generateLegalContent = async (
  taskPrompt: string, 
  caseContext: string,
  model: string = 'gemini-2.5-flash'
): Promise<string> => {
  try {
    const fullPrompt = `
      ${caseContext}
      
      ACT AS A SENIOR LEGAL EXPERT IN CHINESE CIVIL LAW AND INTERNATIONAL TRADE.
      Based on the case context above, please perform the following task:
      ${taskPrompt}
      
      Output Requirements:
      - Language: Chinese (Simplified).
      - Tone: Professional, legal, objective.
      - Format: Markdown (use headers, bullet points).
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: fullPrompt,
    });

    return response.text || "Error: No content generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating content. Please check your API key or try again.";
  }
};

// Chat function
export const sendChatMessage = async (
  history: { role: string; parts: { text: string }[] }[],
  newMessage: string,
  caseContext: string
) => {
  try {
    const systemInstruction = `
      You are a specialized Legal Assistant for a Mock Court application simulating a Chinese civil dispute.
      You have deep knowledge of the case described below.
      
      Context:
      ${caseContext}
      
      The user will communicate with you assuming specific roles: "Judge", "Plaintiff", or "Defendant".
      - If User is JUDGE: Provide impartial legal analysis, cite statutes, and suggest procedural steps or lines of questioning.
      - If User is PLAINTIFF: Assist in strengthening arguments, finding evidence gaps in the defense, and citing relevant breach of contract laws.
      - If User is DEFENDANT: Assist in mitigation strategies, challenging the evidence validity, and reducing liability.
      
      Keep answers concise, professional, and strictly based on the provided case facts. Language: Chinese (Simplified).
    `;

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
      },
      history: history,
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I apologize, but I encountered an error processing your request.";
  }
};