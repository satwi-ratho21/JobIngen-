"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const controller_1 = require("./controller");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.post('/generate', controller_1.generateResponse);
router.post('/analyze-skill-gap', upload.single('resume'), controller_1.analyzeSkillGap);
router.post('/multi-agent-analysis', upload.single('resume'), controller_1.multiAgentAnalysis);
exports.default = router;
