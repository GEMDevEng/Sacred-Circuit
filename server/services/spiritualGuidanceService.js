import { v4 as uuidv4 } from 'uuid';

/**
 * Enhanced spiritual guidance prompts and context management
 */

// Base spiritual guidance system prompt
export const BASE_SPIRITUAL_PROMPT = `
You are a compassionate spiritual guide for the Sacred Healing Companion & Journey Hub.
Your purpose is to provide heart-centered guidance to users on their healing journeys.

Core Guidelines:
- Speak with warmth, compassion, and spiritual wisdom
- Avoid making medical claims or diagnosing conditions
- Encourage self-reflection and personal sovereignty
- Respect all spiritual traditions and beliefs
- Use gentle, supportive language that honors the sacred nature of healing
- Respect user privacy and confidentiality
- If users ask about fasting or detoxification, emphasize safety and listening to one's body
- Avoid giving specific medical advice; suggest consulting healthcare providers when appropriate
- Respond to emotional distress with empathy and appropriate resources

The user will interact with you using their "Healing Name" - a pseudonym they've chosen for privacy.
`;

// Journey stage specific prompts
export const JOURNEY_STAGE_PROMPTS = {
  beginning: `
The user is at the beginning of their healing journey. They may feel:
- Uncertain about where to start
- Overwhelmed by possibilities
- Curious but cautious
- Ready for gentle guidance

Focus on:
- Welcoming them with warmth
- Providing simple, accessible practices
- Building confidence and trust
- Explaining concepts gently
- Offering encouragement and validation
`,

  exploring: `
The user is actively exploring their healing path. They may be:
- Trying different practices
- Asking deeper questions
- Experiencing some resistance or challenges
- Seeking more specific guidance

Focus on:
- Supporting their exploration
- Helping them navigate challenges
- Offering varied practices and perspectives
- Encouraging self-discovery
- Validating their experiences
`,

  deepening: `
The user is deepening their practice and understanding. They may be:
- Experiencing profound insights
- Working through deeper patterns
- Seeking advanced guidance
- Integrating spiritual practices into daily life

Focus on:
- Honoring their growth and insights
- Offering more nuanced guidance
- Supporting integration of experiences
- Encouraging continued practice
- Addressing complex spiritual questions
`,

  integrating: `
The user is integrating their healing journey into their life. They may be:
- Sharing their wisdom with others
- Maintaining consistent practices
- Seeking ways to serve
- Balancing spiritual growth with daily responsibilities

Focus on:
- Celebrating their progress
- Supporting their service to others
- Helping maintain balance
- Encouraging continued growth
- Offering advanced practices and wisdom
`
};

// Mood-specific response adjustments
export const MOOD_ADJUSTMENTS = {
  peaceful: {
    tone: "gentle and affirming",
    suggestions: ["Continue nurturing this peace", "Explore gratitude practices", "Share this peace with others"]
  },
  
  anxious: {
    tone: "calming and grounding",
    suggestions: ["Breathing exercises", "Grounding techniques", "Gentle movement", "Present moment awareness"]
  },
  
  curious: {
    tone: "encouraging and exploratory",
    suggestions: ["New practices to explore", "Books or resources", "Questions for self-reflection"]
  },
  
  struggling: {
    tone: "compassionate and supportive",
    suggestions: ["Self-compassion practices", "Gentle healing approaches", "Professional support if needed"]
  },
  
  grateful: {
    tone: "celebratory and expansive",
    suggestions: ["Gratitude practices", "Ways to share blessings", "Deepening appreciation"]
  }
};

// Spiritual exercises library
export const SPIRITUAL_EXERCISES = {
  breathing: [
    {
      id: uuidv4(),
      type: 'breathing',
      title: '4-7-8 Calming Breath',
      description: 'A simple breathing technique to promote relaxation and inner peace',
      duration: 5,
      instructions: [
        'Sit comfortably with your back straight',
        'Exhale completely through your mouth',
        'Close your mouth and inhale through your nose for 4 counts',
        'Hold your breath for 7 counts',
        'Exhale through your mouth for 8 counts',
        'Repeat this cycle 3-4 times'
      ],
      benefits: ['Reduces anxiety', 'Promotes relaxation', 'Improves sleep quality'],
      difficulty: 'beginner',
      tags: ['breathing', 'anxiety', 'relaxation']
    },
    {
      id: uuidv4(),
      type: 'breathing',
      title: 'Heart-Centered Breathing',
      description: 'Connect with your heart center through conscious breathing',
      duration: 10,
      instructions: [
        'Place one hand on your heart, one on your belly',
        'Breathe naturally and feel the rhythm of your heart',
        'Imagine breathing directly into your heart space',
        'With each inhale, invite love and compassion in',
        'With each exhale, send love to yourself and others',
        'Continue for 5-10 minutes'
      ],
      benefits: ['Opens heart chakra', 'Increases self-compassion', 'Connects to universal love'],
      difficulty: 'intermediate',
      tags: ['heart', 'love', 'compassion', 'chakra']
    }
  ],

  meditation: [
    {
      id: uuidv4(),
      type: 'meditation',
      title: 'Loving-Kindness Meditation',
      description: 'Cultivate compassion for yourself and others',
      duration: 15,
      instructions: [
        'Sit comfortably and close your eyes',
        'Begin by sending loving-kindness to yourself: "May I be happy, may I be healthy, may I be at peace"',
        'Extend these wishes to a loved one',
        'Include a neutral person in your life',
        'Send loving-kindness to someone you have difficulty with',
        'Finally, extend these wishes to all beings everywhere'
      ],
      benefits: ['Increases compassion', 'Reduces negative emotions', 'Promotes emotional healing'],
      difficulty: 'beginner',
      tags: ['compassion', 'love', 'healing', 'forgiveness']
    },
    {
      id: uuidv4(),
      type: 'meditation',
      title: 'Sacred Light Meditation',
      description: 'Connect with divine light for healing and guidance',
      duration: 20,
      instructions: [
        'Sit in a quiet space and close your eyes',
        'Imagine a golden light above your head',
        'See this light slowly descending into your crown',
        'Feel the light filling your entire being',
        'Allow the light to heal any areas of tension or pain',
        'Rest in this sacred light for several minutes',
        'When ready, slowly open your eyes'
      ],
      benefits: ['Spiritual connection', 'Energy healing', 'Inner peace'],
      difficulty: 'intermediate',
      tags: ['light', 'healing', 'spiritual', 'energy']
    }
  ],

  reflection: [
    {
      id: uuidv4(),
      type: 'reflection',
      title: 'Gratitude Reflection',
      description: 'Deepen appreciation for life\'s blessings',
      duration: 10,
      instructions: [
        'Find a quiet moment to sit with your journal',
        'Reflect on three things you\'re grateful for today',
        'For each item, write why you\'re grateful',
        'Notice how gratitude feels in your body',
        'Consider how you might share this gratitude with others'
      ],
      benefits: ['Increases positivity', 'Shifts perspective', 'Enhances well-being'],
      difficulty: 'beginner',
      tags: ['gratitude', 'journaling', 'positivity']
    }
  ],

  affirmation: [
    {
      id: uuidv4(),
      type: 'affirmation',
      title: 'Sacred Self-Worth Affirmations',
      description: 'Affirm your inherent worth and divine nature',
      duration: 5,
      instructions: [
        'Stand or sit with confidence',
        'Place your hand on your heart',
        'Repeat each affirmation with conviction:',
        '"I am worthy of love and healing"',
        '"I trust my inner wisdom"',
        '"I am connected to the divine source"',
        '"My healing journey is sacred and honored"',
        'Feel the truth of these words in your being'
      ],
      benefits: ['Builds self-worth', 'Increases confidence', 'Connects to divine nature'],
      difficulty: 'beginner',
      tags: ['self-worth', 'confidence', 'divine', 'affirmation']
    }
  ]
};

/**
 * Generate context-aware spiritual guidance prompt
 * @param {Object} context - Spiritual context information
 * @returns {string} - Enhanced system prompt
 */
export function generateContextualPrompt(context = {}) {
  let prompt = BASE_SPIRITUAL_PROMPT;

  // Add journey stage context
  if (context.journeyStage && JOURNEY_STAGE_PROMPTS[context.journeyStage]) {
    prompt += "\n\nJourney Stage Context:\n" + JOURNEY_STAGE_PROMPTS[context.journeyStage];
  }

  // Add mood adjustments
  if (context.currentMood && MOOD_ADJUSTMENTS[context.currentMood]) {
    const moodInfo = MOOD_ADJUSTMENTS[context.currentMood];
    prompt += `\n\nCurrent Mood Context:\nThe user seems to be feeling ${context.currentMood}. `;
    prompt += `Respond with a ${moodInfo.tone} tone. `;
    prompt += `Consider suggesting: ${moodInfo.suggestions.join(', ')}.`;
  }

  // Add practice preferences
  if (context.practicePreferences && context.practicePreferences.length > 0) {
    prompt += `\n\nPractice Preferences:\nThe user has shown interest in: ${context.practicePreferences.join(', ')}.`;
  }

  // Add healing goals
  if (context.healingGoals && context.healingGoals.length > 0) {
    prompt += `\n\nHealing Goals:\nThe user's healing goals include: ${context.healingGoals.join(', ')}.`;
  }

  // Add session context
  if (context.sessionCount) {
    if (context.sessionCount === 1) {
      prompt += "\n\nThis is the user's first session. Be especially welcoming and gentle.";
    } else if (context.sessionCount < 5) {
      prompt += "\n\nThis is an early session in their journey. Continue building trust and foundation.";
    } else {
      prompt += "\n\nThis user has been on their journey for a while. You can offer deeper insights.";
    }
  }

  return prompt;
}

/**
 * Get personalized exercise recommendations
 * @param {Object} context - User context
 * @returns {Array} - Array of recommended exercises
 */
export function getPersonalizedExercises(context = {}) {
  const recommendations = [];
  
  // Mood-based recommendations
  if (context.currentMood === 'anxious') {
    recommendations.push(...SPIRITUAL_EXERCISES.breathing);
  } else if (context.currentMood === 'struggling') {
    recommendations.push(...SPIRITUAL_EXERCISES.meditation.filter(ex => 
      ex.tags.includes('compassion') || ex.tags.includes('healing')
    ));
  } else if (context.currentMood === 'grateful') {
    recommendations.push(...SPIRITUAL_EXERCISES.reflection.filter(ex => 
      ex.tags.includes('gratitude')
    ));
  }

  // Journey stage recommendations
  if (context.journeyStage === 'beginning') {
    recommendations.push(...SPIRITUAL_EXERCISES.breathing.filter(ex => 
      ex.difficulty === 'beginner'
    ));
    recommendations.push(...SPIRITUAL_EXERCISES.affirmation);
  } else if (context.journeyStage === 'deepening') {
    recommendations.push(...SPIRITUAL_EXERCISES.meditation.filter(ex => 
      ex.difficulty === 'intermediate'
    ));
  }

  // Practice preference recommendations
  if (context.practicePreferences) {
    context.practicePreferences.forEach(preference => {
      Object.values(SPIRITUAL_EXERCISES).flat().forEach(exercise => {
        if (exercise.tags.includes(preference.toLowerCase()) && 
            !recommendations.find(r => r.id === exercise.id)) {
          recommendations.push(exercise);
        }
      });
    });
  }

  // Return top 3 recommendations
  return recommendations.slice(0, 3);
}

/**
 * Generate healing recommendations based on context
 * @param {Object} context - User context
 * @returns {Array} - Array of healing recommendations
 */
export function generateHealingRecommendations(context = {}) {
  const recommendations = [];

  // Anxiety support
  if (context.currentMood === 'anxious') {
    recommendations.push({
      id: uuidv4(),
      type: 'exercise',
      title: 'Grounding Practice for Anxiety',
      description: 'A gentle practice to help you feel more centered and calm',
      reason: 'Your current state suggests you might benefit from grounding techniques',
      priority: 'high',
      estimatedTime: 10,
      exercises: SPIRITUAL_EXERCISES.breathing.filter(ex => ex.tags.includes('anxiety'))
    });
  }

  // Beginner support
  if (context.journeyStage === 'beginning') {
    recommendations.push({
      id: uuidv4(),
      type: 'practice',
      title: 'Daily Sacred Moments',
      description: 'Simple ways to bring spirituality into your everyday life',
      reason: 'As you begin your journey, establishing daily practices can provide foundation',
      priority: 'medium',
      estimatedTime: 15,
      resources: [
        {
          title: 'Morning Intention Setting',
          description: 'Start each day by setting a sacred intention'
        },
        {
          title: 'Evening Gratitude',
          description: 'End each day by acknowledging three blessings'
        }
      ]
    });
  }

  // Self-compassion for struggling
  if (context.currentMood === 'struggling') {
    recommendations.push({
      id: uuidv4(),
      type: 'reflection',
      title: 'Self-Compassion Practice',
      description: 'Gentle practices to nurture yourself through difficult times',
      reason: 'During challenging times, self-compassion can be deeply healing',
      priority: 'high',
      estimatedTime: 20,
      exercises: SPIRITUAL_EXERCISES.meditation.filter(ex => ex.tags.includes('compassion'))
    });
  }

  return recommendations;
}

/**
 * Extract topics and mood from conversation history
 * @param {Array} messages - Array of chat messages
 * @returns {Object} - Extracted context
 */
export function extractContextFromHistory(messages = []) {
  const context = {
    previousTopics: [],
    sessionCount: Math.ceil(messages.length / 2), // Rough estimate
    practicePreferences: []
  };

  // Simple keyword extraction for topics and mood
  const allText = messages.map(m => m.content.toLowerCase()).join(' ');
  
  // Topic extraction
  const topicKeywords = {
    meditation: ['meditat', 'mindful', 'awareness'],
    breathing: ['breath', 'breathing', 'pranayama'],
    anxiety: ['anxious', 'worry', 'stress', 'nervous'],
    gratitude: ['grateful', 'thankful', 'appreciation'],
    healing: ['heal', 'recovery', 'wellness'],
    love: ['love', 'compassion', 'kindness'],
    spiritual: ['spiritual', 'divine', 'sacred', 'soul']
  };

  Object.entries(topicKeywords).forEach(([topic, keywords]) => {
    if (keywords.some(keyword => allText.includes(keyword))) {
      context.previousTopics.push(topic);
      context.practicePreferences.push(topic);
    }
  });

  // Mood detection
  const moodKeywords = {
    anxious: ['anxious', 'worried', 'stress', 'overwhelm'],
    peaceful: ['peaceful', 'calm', 'serene', 'tranquil'],
    grateful: ['grateful', 'thankful', 'blessed', 'appreciate'],
    struggling: ['difficult', 'hard', 'struggle', 'challenge'],
    curious: ['curious', 'wonder', 'explore', 'learn']
  };

  Object.entries(moodKeywords).forEach(([mood, keywords]) => {
    if (keywords.some(keyword => allText.includes(keyword))) {
      context.currentMood = mood;
    }
  });

  return context;
}
