import { Router } from 'express';
import multer from 'multer';
import { generateResponse, analyzeSkillGap, multiAgentAnalysis } from './controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/generate', generateResponse);
router.post('/analyze-skill-gap', upload.single('resume'), analyzeSkillGap);
router.post('/multi-agent-analysis', upload.single('resume'), multiAgentAnalysis);

export default router;