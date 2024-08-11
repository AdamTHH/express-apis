import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import Routes from './src/routes';


dotenv.config();

const PORT = process.env.PORT || 5000;

const app: Express = express();

app.use(express.json());

app.use('/api', Routes);

app.use(cors());

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});

app.get('/', (req: Request, res: Response) => {
    res.send('hi');
});