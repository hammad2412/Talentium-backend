import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const parseResumeWithAI = async (resumeText) => {
  const prompt = `
Extract ONLY the following information from this resume.

Return ONLY valid JSON.
Do not use markdown.
Do not wrap the response in \`\`\`json.
Do not add explanations.

Rules:
1. "headline" should be the candidate's professional title, such as:
   - Frontend Developer
   - MERN Stack Developer
   - Full Stack Developer
   - Software Engineer
2. "skills" must be an array of strings only.
3. If any field is missing, return an empty string or empty array.

Return this exact JSON structure:

{
  "headline": "",
  "skills": []
}

Resume:
${resumeText}
`;

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    contents: prompt,
  });

  let text = response.text.trim();

  // Remove markdown code fences if present
  text = text.replace(/^```json\s*/i, "");
  text = text.replace(/^```\s*/i, "");
  text = text.replace(/\s*```$/i, "");

  const parsed = JSON.parse(text);

  return {
    headline: parsed.headline || "",
    skills: Array.isArray(parsed.skills)
      ? parsed.skills.filter(
          (skill) => typeof skill === "string" && skill.trim() !== "",
        )
      : [],
  };
};
