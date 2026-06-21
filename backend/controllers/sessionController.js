const Session = require("../models/Session");
const Question = require("../models/Question");

exports.createSession = async (req, res) => {
    try {
        const { role, experience, topicsToFocus, description, questions} = req.body;
        const userId = req.user._id;

        let parsedQuestions = questions;

        // --- GROQ CLEANER: If Groq returned a string, clean and parse it ---
        if (typeof parsedQuestions === 'string') {
            try {
                // Strip out markdown code blocks (```json and ```)
                const cleanedString = parsedQuestions.replace(/```json/gi, '').replace(/```/g, '').trim();
                parsedQuestions = JSON.parse(cleanedString);
            } catch (err) {
                console.error("🔥 Failed to parse Groq string:", parsedQuestions);
                return res.status(400).json({ 
                    success: false, 
                    message: "Failed to parse AI response. Please try generating questions again." 
                });
            }
        }

        // --- UNWRAPPER: If Groq returned { questions: [...] } instead of [...] ---
        if (parsedQuestions && typeof parsedQuestions === 'object' && !Array.isArray(parsedQuestions)) {
            parsedQuestions = parsedQuestions.questions || parsedQuestions.data || [];
        }

        // --- FINAL SAFETY CHECK ---
        if (!Array.isArray(parsedQuestions)) {
            console.error("🔥 Expected array, but got:", typeof parsedQuestions, parsedQuestions);
            return res.status(400).json({ 
                success: false, 
                message: "AI did not return a valid list of questions." 
            });
        }


        const session = new Session({
            user: userId,
            role,
            experience,
            topicsToFocus,
            description,
        });

        const questionDocs = await Promise.all(parsedQuestions.map(async (q) => {
            const question = await Question.create({
                session: session._id,
                question: q.question,
                answer: q.answer,
            });
            return question._id;
        }));

        session.questions = questionDocs;
        await session.save();

        res.status(201).json({ success:true, session});
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getMySessions = async (req, res) => {
    try {
        const sessions = await Session.find({ user: req.user._id }).sort({ createdAt: -1 }).populate("questions");
        res.status(200).json(sessions);
    } catch (error) {
        console.error("🔥 FATAL ERROR IN createSession:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getSessionById = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id).populate({
            path: "questions",
            options: { sort: { isPinned: -1, createdAt: -1 } },
        })
        .exec();

        if (!session) {
            return res.status(404).json({ success: false, message: "Session not found" });
        }

        res.status(200).json({ success: true, session });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

exports.deleteSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        if (session.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized to delete this session" });
        }
        await Question.deleteMany({ session: session._id });

        await session.deleteOne();

        res.status(200).json({ message: "Session deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};