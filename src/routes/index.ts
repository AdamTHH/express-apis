import { Request, Response, Router } from "express";
import express from "express";

import Claude from "./claude";
import DepositPhotos from "./depositPhotos";

const router: Router = express.Router();

router.use('/mobile/claude', Claude);
router.use('/mobile/depositPhotos', DepositPhotos);

router.get('/', (req: Request, res: Response) => {
    res.json({success:true});
});

export default router;