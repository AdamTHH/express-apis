import { Request, Response, Router } from 'express';
import needle from 'needle';
import { appCheckVerification, secretVerification } from '../firebase';
import Anthropic from "@anthropic-ai/sdk";

const router: Router = Router();

router.post('/', [], async (req: Request, res: Response) => {
    try {
        const prompt = req.body.prompt;
        const result = await generateNewWord(prompt);
        res.json(result);
    } catch (error: ErrorEvent | any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/', [], (req: Request, res: Response) => {
    res.json("you are on mobile");
});

async function generateNewWord(prompt: string) {

    const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
    });

    try {
        const response = await anthropic.messages.create({
            model: "claude-3-haiku-20240307",
            max_tokens: 1000,
            temperature: 0.9,
            system: "Your task is to combine two given words into a new element, which should be either a real-life object or something made up based on those two words. You will then generate a Stable Diffusion prompt based on the new word.\n\n1. Combine the two words to create a new word. This should be a creative combination that captures elements or concepts from both words. If there is a logical combination answer with that.\n\n2. Determine if the new word you've created is a real word (exists in common usage or dictionaries) or a made-up word.\n\n3. Create a Stable Diffusion prompt based on the new word. This prompt should be descriptive and vivid, helping to create a clear mental image. Use short phrases with \",\" between phrases\n\n4. Format your response as a JSON object with the following structure:\n   {\n     \"newWord\": \"\",\n     \"isARealWord\": true/false,\n     \"sdprompt\": \"\"\n   }\n\nRemember, your entire response should only contain this JSON object. Do not include any additional text or explanations outside of the JSON structure.",
            messages: [
              {
                "role": "user",
                "content": [
                  {
                    "type": "text",
                    "text": "trump+obama"
                  }
                ]
              },
              {
                "role": "assistant",
                "content": [
                  {
                    "type": "text",
                    "text": "{"
                  }
                ]
              }
            ]
          });

          console.log("{" + response);
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export default router;