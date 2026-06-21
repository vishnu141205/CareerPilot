const express = require("express");
const { updateQuestionNote, togglePinQuestion, addQuestionsToSession } = require("../controllers/questionController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/add", protect, addQuestionsToSession);
router.post("/:id/note", protect, updateQuestionNote);
router.post("/:id/pin", protect, togglePinQuestion);

module.exports = router;