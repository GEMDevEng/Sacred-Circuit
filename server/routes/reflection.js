import express from 'express';
import { saveReflection } from '../services/airtableService.js';

const router = express.Router();

/**
 * @route POST /api/reflection
 * @desc Save a user reflection
 * @access Public
 */
router.post('/', async (req, res) => {
  try {
    const { healingName, reflectionText, journeyDay, emailConsent } = req.body;
    
    if (!healingName || !reflectionText) {
      return res.status(400).json({ 
        success: false, 
        error: 'Healing name and reflection text are required' 
      });
    }
    
    const reflection = await saveReflection({
      healingName,
      reflectionText,
      journeyDay: journeyDay || 'Not specified',
      emailConsent: emailConsent || false
    });
    
    return res.status(201).json({
      success: true,
      data: reflection
    });
  } catch (error) {
    console.error('Reflection error:', error);
    return res.status(500).json({
      success: false,
      error: 'Error saving reflection'
    });
  }
});

export default router;
