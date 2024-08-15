"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const needle_1 = __importDefault(require("needle"));
const firebase_1 = require("../firebase");
const router = (0, express_1.Router)();
router.post('/', [firebase_1.appCheckVerification], async (req, res) => {
    try {
        const prompt = req.body.prompt;
        const result = await generateNewWord(prompt);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
router.get('/', [firebase_1.appCheckVerification], (req, res) => {
    res.json("you are on mobile");
});
async function generateNewWord(prompt) {
    const url = 'https://api.anthropic.com/v1/messages';
    const headers = {
        'X-Firebase-AppCheck': "anyad",
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
    };
    const body = {
        model: 'claude-3-haiku-20240307',
        max_tokens: 1024,
        system: "combine the 2 given words",
        messages: [
            {
                role: 'user',
                content: prompt
            }
        ]
    };
    try {
        const response = await (0, needle_1.default)('post', url, body, { headers: headers });
        if (response.statusCode === 200) {
            return response.body;
        }
        else {
            console.error('Error:', response.body);
            throw new Error(`Error: ${JSON.stringify(response.body)}`);
        }
    }
    catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
;
exports.default = router;
//# sourceMappingURL=claude.js.map