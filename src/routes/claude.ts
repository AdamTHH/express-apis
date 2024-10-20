import { Request, Response, Router } from 'express';
import needle from 'needle';
import { appCheckVerification, secretVerification } from '../firebase';
import Anthropic from "@anthropic-ai/sdk";

const router: Router = Router();

router.post('/', [secretVerification], async (req: Request, res: Response) => {
    try {
        const prompt = req.body.prompt;
        const result = await generateNewWord(prompt);
        res.json(result);
    } catch (error: ErrorEvent | any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/', [secretVerification], (req: Request, res: Response) => {
    res.json("you are on mobile");
});

async function generateNewWord(prompt: string) {

    const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
    });

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
        temperature: 1,
        system: "Your task is to combine two given words into a new element, which should be either a real-life object or something made up based on those two words. Use an appropriate emoji with it. You will then generate a Stable Diffusion prompt based on the new word.\n\n1. Combine the two words to create a new word. This should be a creative combination that captures elements or concepts from both words. If there is a logical combination answer with that.\n\n2. Use an existing emoji that matches the word.\n\n3. Determine if the new word you've created is a real word (exists in common usage or dictionaries) or a made-up word.\n\n4. Create a Stable Diffusion prompt based on the new word. This prompt should be descriptive and vivid, helping to create a clear mental image. Use short phrases with \",\" between phrases\n\n5. Format your response as a JSON object with the following structure:\n   {\n     \"newWord\": \"\",\n     \"emoji\": \"\",\n     \"isARealWord\": true/false,\n     \"sdprompt\": \"\"\n   }\n\nRemember, your entire response should only contain this JSON object. Do not include any additional text or explanations outside of the JSON structure.",
        messages: [
            {
                role: 'user',
                content: prompt
            },
            {
                role: "assistant",
                content: [
                    {
                        "type": "text",
                        "text": "{"
                    }
                ]
            }
        ]
    }

    try {
        const response = await needle('post', url, body, { headers: headers });
        if (response.statusCode === 200) {
            return JSON.parse("{" + response.body['content'][0]['text']);
        } else {
            console.error('Error:', response.body);
            throw new Error(`Error: ${JSON.stringify(response.body)}`);
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export default router;