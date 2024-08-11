import { Request, Response } from 'express';
import { Router } from 'express';
import needle from 'needle';

const router: Router = Router();

router.post('/', async (req: Request, res: Response) => {
    try {
        const prompt = req.body.prompt;
        const result = await generateNewWord(prompt);
        res.json(result);
    } catch (error: ErrorEvent | any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/', (req: Request, res: Response) => {
    res.json("post");
});

async function generateNewWord(prompt: string) {

    const url = 'https://api.anthropic.com/v1/messages';

    const headers = {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
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
    }

    try {
        const response = await needle('post', url, body, { headers: headers });
        if (response.statusCode === 200) {
            return response.body;
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