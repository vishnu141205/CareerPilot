const Groq = require("groq-sdk");
const { conceptExplainPrompt, questionAnswerPrompt } = require("../utils/prompts");

// Initialize Groq instead of Google
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const generateInterviewQuestions = async (req, res) => {
    try {
        const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

        if(!role || !experience || !topicsToFocus || !numberOfQuestions) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);

        // Groq API Call Structure
        const chatCompletion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant", // Groq's incredibly fast model
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            // Optional: You can force JSON mode in Groq too!
            response_format: { type: "json_object" } ,
            max_tokens: 4000
        });

        // Extracting text from Groq's response object
        let rawText = chatCompletion.choices[0].message.content;

        const cleanedText = rawText.replace(/^```json\s*/, "").replace(/```$/, "").trim();
        const data = JSON.parse(cleanedText);

        res.status(200).json(data);
    } catch (error) {
        if (error.status === 429 || (error.message && error.message.includes("rate limit"))) {
            return res.status(429).json({ 
                message: "The AI is taking a quick break! Please wait a moment and try again." 
            });
        }
        res.status(500).json({ message: "Failed to generate questions", error: error.message });
    }
};

const generateConceptExplanation = async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ message: "Question is required" });
        }
        
        const prompt = conceptExplainPrompt(question);

        // Groq API Call Structure
        const chatCompletion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            response_format: { type: "json_object" }
        });

        // Extracting text from Groq's response object
        let rawText = chatCompletion.choices[0].message.content;
        
        const cleanedText = rawText.replace(/^```json\s*/, "").replace(/```$/, "").trim();
        const data = JSON.parse(cleanedText);

        res.status(200).json(data);
    } catch (error) {
        if (error.status === 429 || (error.message && error.message.includes("rate limit"))) {
            return res.status(429).json({ 
                message: "The AI is taking a quick break! Please wait a moment and try again." 
            });
        }
        res.status(500).json({ message: "Failed to generate explanation", error: error.message });
    }
};

module.exports = { generateInterviewQuestions, generateConceptExplanation };