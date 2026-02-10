import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const analyzeCode = async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ error: 'Code is required' });
        }
        if (typeof code !== 'string') {
            return res.status(400).json({ error: 'Code must be a string' });
        }
        if (code.length > 200_000) {
            return res.status(413).json({ error: 'Code payload too large' });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({
                error: 'Gemini API key is not configured',
                details: 'Please add GEMINI_API_KEY to your backend .env file.'
            });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest",
        });

        const prompt = `
            Analyze this code and return a JSON object.
            Keep titles and descriptions simple and professional.
            Provide exactly 3 to 5 accurate tags.
            Respond with ONLY valid JSON (no markdown, no extra text).
            
            {
              "title": "Clear and simple title",
              "description": "Brief description of what the code does",
              "language": "programming language",
              "tags": ["tag1", "tag2", "tag3"]
            }
            
            Code:
            ${code}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Improved JSON extraction
        let analysis;
        try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            const cleanText = jsonMatch ? jsonMatch[0] : text;
            analysis = JSON.parse(cleanText);
        } catch (e) {
            console.error('❌ Failed to parse Gemini response:', text);
            // Fallback object
            analysis = {
                title: "ANALYSIS_FAILED",
                description: "THE_SYSTEM_COULD_NOT_DECODE_THE_DATA_STREAM.",
                language: "UNKNOWN",
                tags: ["SYSTEM_ERROR"]
            };
        }

        if (process.env.NODE_ENV !== 'production') {
            console.log('✅ Gemini analysis successful:', analysis.title);
        }
        res.json(analysis);
    } catch (error) {
        console.error('❌ Gemini Analysis Error:', error.message);
        res.status(500).json({
            error: 'Failed to analyze code with Gemini',
            details: error.message
        });
    }
};
