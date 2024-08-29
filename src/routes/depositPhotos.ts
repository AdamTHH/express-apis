import { Request, Response, Router } from 'express';
import needle from 'needle';
import { appCheckVerification, secretVerification } from '../firebase';

const router: Router = Router();

router.post('/', [secretVerification], async (req: Request, res: Response) => {
    try {
        const prompt = req.body.prompt;
        const result = await searchImage(prompt);
        res.json(result);
    } catch (error: ErrorEvent | any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/', [secretVerification], (req: Request, res: Response) => {
    res.json("you are on mobile");
});

async function searchImage(prompt: string) {
    const randomOffset = Math.floor(Math.random() * 21);
    
    const url = `https://api.depositphotos.com/?dp_command=search&dp_apikey=${process.env.DEPOSITPHOTOS_API_KEY}&dp_search_query=${prompt}&dp_search_limit=1&dp_search_offset=${randomOffset}`;

    try {
        const response = await needle('post', url, {}, { });
        if (response.statusCode === 200) {
            return response.body['result'][0]['thumb_max'];
        } else {
            console.error('Error:', response.body);
            throw new Error(`Error: ${JSON.stringify(response.body)}`);
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
export default router;