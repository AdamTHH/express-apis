import { Request, Response, Router } from "express";
import express from "express";

import Claude from "./claude";

const router: Router = express.Router();

router.use('/claude', Claude);

router.get('/', (req: Request, res: Response) => {
    res.json({success:true});
});

export default router;