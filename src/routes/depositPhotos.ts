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
    const url = `https://api.depositphotos.com/?dp_command=search&dp_apikey=77d471e7324e7e00260a9d559809555519252ca0&dp_search_query=${prompt}&dp_search_limit=1&dp_search_orientation=square`;
    const headers = {
        'Cookie': 'browserSessionId=14ea807a7f73ce0485f617cb13ead1ba151f5aa4ed74383868fc2640b53f51ad'
    };

    try {
        const response = await needle('post', url, {}, { headers: headers });
        if (response.statusCode === 200) {
            return response.body['result'][0]['url_max_qa'];
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