import { Request, Response, Router } from 'express';
import needle from 'needle';
import { appCheckVerification, secretVerification } from '../firebase';

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
        system: "Your job is to combine the given words into a third element. This should be either a real life object or something made up based on those 2 words. You must not concatenate the words ('A+B' must not equal 'AB'). Generate Stable Diffusion prompt based on the new word (max 20 words). Reply ONLY with a JSON like:\n'{\"newWord\":\"\",\"isARealWord\": true/false,\"sdprompt\":\"\"}'",
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