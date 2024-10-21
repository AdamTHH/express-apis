import { Request, Response, Router } from 'express';
import needle from 'needle';
import { appCheckVerification, secretVerification } from '../firebase';

const router: Router = Router();

router.post('/', [secretVerification], async (req: Request, res: Response) => {
    try {
        const prompt = req.body.prompt;
        const result = await generateImage(prompt);
        res.json(result);
    } catch (error: ErrorEvent | any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/', [secretVerification], (req: Request, res: Response) => {
    res.json("you are on mobile");
});

async function generateImage(prompt: string) {

    const encodedPrompt = encodeURIComponent(prompt);

    const url = 'https://image.pollinations.ai/prompt/' + encodedPrompt;

    try {
        const response = await needle('get', url);
        if (response.statusCode === 200) {
            return url;
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