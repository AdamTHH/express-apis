"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const claude_1 = __importDefault(require("./claude"));
const router = express_1.default.Router();
router.use('/mobile/claude', claude_1.default);
router.get('/', (req, res) => {
    res.json({ success: true });
});
exports.default = router;
//# sourceMappingURL=index.js.map