import { GoogleGenerativeAI } from "@google/generative-ai";
import { HfInference } from '@huggingface/inference';
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

export const chatWithAI = async (req, res) => {
    try {
        const { message, history, pathname } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const hfKey = process.env.HUGGINGFACE_API_KEY;
        if (!hfKey) {
            return res.status(500).json({
                error: 'Hugging Face API key is not configured',
                details: 'Please add HUGGINGFACE_API_KEY to your backend .env file.'
            });
        }

        const hfClient = new HfInference(hfKey);

        const systemInstruction = `You are CodeVault AI, an elite personal tutor and study assistant. You have agentic capabilities to control the UI.
            
**CRITICAL CAPABILITIES**:
1. **UI CONTROL**: Trigger tags at the VERY END.
   - Pages: [NAV_VAULT], [NAV_EXPLORE], [NAV_FAVORITES], [NAV_PROJECTS], [NAV_LEARN], [NAV_NOTES], [NAV_COMPILER], [NAV_TODO], [NAV_PROFILE], [NAV_SUPPORT]
   - Actions: [TOGGLE_THEME], [CLEAR_CHAT], [EXPAND_AI], [MINIMIZE_AI], [RESTART_TOUR]

2. **AGENTIC COMMANDS (CMD TAGS)**:
   - **WRITING CODE**: [CMD_WRITE_CODE]{"language": "python", "code": "...", "fileName": "app.py", "autoRun": true}[/CMD_WRITE_CODE]
   - **RUNNING CODE**: [CMD_RUN_CODE]{}[/CMD_RUN_CODE] (Triggers compiler logic)
   - **TASKS**: [CMD_ADD_TASKS]{"tasks": ["..."]}[/CMD_ADD_TASKS] or [CMD_CLEAR_TASKS]{}[/CMD_CLEAR_TASKS]
   - **SEARCH**: [CMD_SEARCH_COMMUNITY]{"query": "..."}[/CMD_SEARCH_COMMUNITY], [CMD_SEARCH_NOTES]{"query": "..."}[/CMD_SEARCH_NOTES], [CMD_SEARCH_FAVORITES]{"query": "..."}[/CMD_SEARCH_FAVORITES]

3. **CONTEXT AWARENESS**: Current page: ${pathname || '/'}. 

**MANDATORY ETIQUETTE**:
- Tags MUST be at the end EXACTLY as shown (use brackets and correct case).
- If generating code, ALWAYS use [CMD_WRITE_CODE] with autoRun:true.
- CRITICAL: When using [CMD_WRITE_CODE], DO NOT print the code block in your conversational response. ONLY put the code inside the JSON payload to save space. Just say "I'm writing the code for you now."
- You are a helpful, friendly, and conversational AI assistant. Do NOT use overly technical or robotic language. Do NOT expose or mention raw tags in your conversational response.`;

        // Convert history from frontend format (role: 'user'|'model', content: string)
        // to Hugging Face chat completion format (role: 'user'|'assistant'|'system', content: string)
        const formattedMessages = [
            { role: 'system', content: systemInstruction },
            ...(history || []).map(h => ({
                role: h.role === 'model' ? 'assistant' : 'user',
                content: h.content
            })),
            { role: 'user', content: message }
        ];

        // Call Hugging Face API securely on the backend
        const response = await hfClient.chatCompletion({
            model: "meta-llama/Meta-Llama-3-8B-Instruct",
            messages: formattedMessages,
            max_tokens: 2000,
            temperature: 0.7,
        });

        const textOutput = response.choices?.[0]?.message?.content || "";
        res.json({ response: textOutput });
    } catch (error) {
        console.error('❌ HuggingFace Chat Error:', error.message);
        res.status(500).json({
            error: 'Failed to communicate with Hugging Face AI',
            details: error.message
        });
    }
};
