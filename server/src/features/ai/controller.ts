import { Request, Response } from 'express';
import { generateAIResponse, analyzeSkillGapService } from './service';
import { runMultiAgentAnalysis } from './agents';

export const generateResponse = async (req: Request, res: Response) => {
  try {
    const { prompt, model = 'gemini-2.5-flash' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    const response = await generateAIResponse(prompt, model);
    res.json({ response });
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const analyzeSkillGap = async (req: Request, res: Response) => {
  try {
    const { targetRole } = req.body;
    const file = (req as any).file;

    if (!targetRole) {
      return res.status(400).json({ error: 'Target role is required' });
    }

    let content = '';
    let mimeType = '';

    if (file) {
      content = file.buffer.toString('base64');
      mimeType = file.mimetype;
    } else if (req.body.content) {
      content = req.body.content;
      mimeType = req.body.mimeType || 'text/plain';
    } else {
      return res.status(400).json({ error: 'Resume content or file is required' });
    }

    const result = await analyzeSkillGapService({ content, mimeType }, targetRole);
    res.json(result);
  } catch (error) {
    console.error('Error analyzing skill gap:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const multiAgentAnalysis = async (req: Request, res: Response) => {
  try {
    const { targetRole } = req.body;
    const file = (req as any).file;

    // Extract resume text from file or body
    let resumeText = '';

    if (file) {
      // Handle text files and plain text uploads
      resumeText = file.buffer.toString('utf-8');
    } else if (req.body.resumeText) {
      resumeText = req.body.resumeText;
    } else {
      return res.status(400).json({ error: 'Resume content or file is required' });
    }

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ error: 'Resume cannot be empty' });
    }

    // Run multi-agent analysis
    const analysisResult = await runMultiAgentAnalysis(resumeText, targetRole || undefined);

    // Return comprehensive analysis results
    res.json({
      success: true,
      data: analysisResult,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in multi-agent analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Multi-agent analysis failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};