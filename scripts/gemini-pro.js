/**
 * 🤖 Google Gemini Pro API Integration
 * AI-powered content generation for entrepreneurship YouTube channel
 */

class GeminiProAutomation {
    constructor(apiKey, modelName = 'gemini-pro') {
        this.apiKey = apiKey;
        this.modelName = modelName;
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
    }

    /**
     * Generate video script using Gemini Pro
     * @param {Object} params - Script parameters
     * @returns {Object} Generated script
     */
    async generateVideoScript(params) {
        const {
            topic,
            duration = 8, // minutes
            style = 'educational',
            audience = 'hindi_entrepreneurs',
            hookType = 'problem_solution'
        } = params;

        const prompt = this.buildScriptPrompt(topic, duration, style, audience, hookType);
        
        try {
            const response = await this.callGeminiAPI(prompt);
            return this.parseScriptResponse(response);
        } catch (error) {
            console.error('❌ Script generation failed:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Build comprehensive script generation prompt
     * @param {string} topic - Video topic
     * @param {number} duration - Video duration in minutes
     * @param {string} style - Content style
     * @param {string} audience - Target audience
     * @param {string} hookType - Hook type
     * @returns {string} Complete prompt
     */
    buildScriptPrompt(topic, duration, style, audience, hookType) {
        return `
आप एक expert YouTube content creator हैं जो entrepreneurship और business topics पर videos बनाते हैं।

TASK: "${topic}" के लिए ${duration}-minute का detailed video script बनाएं।

AUDIENCE: Hindi-speaking entrepreneurs और business enthusiasts (age 22-35)
STYLE: ${style} - practical, actionable, engaging
HOOK TYPE: ${hookType}

SCRIPT STRUCTURE REQUIREMENTS:

1. HOOK (0-15 seconds):
   - Strong opening statement
   - Promise value/solution
   - Create curiosity
   - Use numbers/statistics if relevant

2. INTRODUCTION (15-45 seconds):
   - Personal connection/story
   - Why this topic matters NOW
   - What viewer will learn
   - Brief agenda overview

3. MAIN CONTENT (45s - ${duration-1} minutes):
   - 3-5 key points with clear sub-sections
   - Practical examples and case studies
   - Step-by-step actionable advice
   - Common mistakes to avoid
   - Success stories/failures

4. CALL TO ACTION (Last 30 seconds):
   - Summarize key takeaways
   - Next steps for viewer
   - Subscribe/like reminder
   - Connect on social media
   - Preview next video

CONTENT GUIDELINES:
- Use simple Hindi + English mix (Hinglish)
- Include real examples from Indian market
- Add specific numbers, statistics, facts
- Keep sentences short and conversational
- Use rhetorical questions to maintain engagement
- Include personal anecdotes if relevant
- Add humor where appropriate (clean, professional)

OUTPUT FORMAT:
{
  "title_suggestions": ["3 catchy title options"],
  "hook_options": ["3 different hook variations"],
  "full_script": "Complete script with timestamps",
  "key_points": ["Main takeaways"],
  "engagement_moments": ["When to ask questions/interact"],
  "visual_cues": ["Suggestions for b-roll, graphics, text overlays"],
  "seo_keywords": ["10-15 relevant keywords"],
  "thumbnail_text": ["3 thumbnail text options"]
}

Remember: Script should feel natural, conversational, and provide genuine value to aspiring entrepreneurs.
`;
    }

    /**
     * Generate content research and trending topics
     * @param {Object} params - Research parameters
     * @returns {Object} Research results
     */
    async generateContentResearch(params) {
        const {
            niche = 'entrepreneurship',
            region = 'india',
            timeframe = 'current',
            contentType = 'youtube_videos'
        } = params;

        const prompt = `
आप एक expert content strategist हैं। ${niche} niche में ${region} के लिए trending और evergreen content ideas research करें।

RESEARCH REQUIREMENTS:

1. TRENDING TOPICS (Next 30 days):
   - Current market trends
   - Seasonal opportunities
   - News-jacking opportunities
   - Competitor gap analysis

2. EVERGREEN CONTENT:
   - Fundamental concepts that always work
   - How-to guides with consistent search volume
   - Problem-solution content
   - Step-by-step tutorials

3. CONTENT CLUSTERS:
   - Group related topics into content series
   - Suggest logical content progression
   - Cross-linking opportunities

4. KEYWORD OPPORTUNITIES:
   - High search volume, low competition keywords
   - Long-tail keyword variations
   - Voice search optimized queries
   - Local language variations

5. COMPETITOR ANALYSIS:
   - Top performing content in space
   - Content gaps to exploit
   - Unique angles not being covered

OUTPUT FORMAT:
{
  "trending_topics": [
    {
      "topic": "Topic name",
      "trend_score": "1-10",
      "search_volume": "estimated monthly",
      "competition": "low/medium/high",
      "content_angle": "unique approach",
      "urgency": "how time-sensitive"
    }
  ],
  "evergreen_topics": [
    {
      "topic": "Topic name",
      "search_volume": "consistent monthly volume",
      "difficulty": "content creation difficulty",
      "value_score": "1-10",
      "content_series_potential": "yes/no"
    }
  ],
  "content_clusters": [
    {
      "cluster_name": "Series name",
      "topics": ["Topic 1", "Topic 2", "Topic 3"],
      "content_progression": "logical order",
      "estimated_videos": "number of videos"
    }
  ],
  "keyword_opportunities": [
    {
      "keyword": "keyword phrase",
      "search_volume": "monthly volume",
      "difficulty": "1-100",
      "intent": "informational/commercial/navigational",
      "content_type": "best format for this keyword"
    }
  ]
}

Focus on Indian entrepreneurship ecosystem, startup culture, business opportunities, and practical money-making strategies.
`;

        try {
            const response = await this.callGeminiAPI(prompt);
            return { success: true, research: JSON.parse(response) };
        } catch (error) {
            console.error('❌ Content research failed:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Generate optimized titles and thumbnails
     * @param {Object} content - Content details
     * @returns {Object} Title and thumbnail suggestions
     */
    async generateTitlesAndThumbnails(content) {
        const { topic, keyPoints, targetAudience } = content;

        const prompt = `
Content Topic: "${topic}"
Key Points: ${keyPoints.join(', ')}
Audience: ${targetAudience}

Generate YouTube-optimized titles and thumbnail concepts:

TITLE REQUIREMENTS:
- 50-60 characters optimal
- Include power words (Complete, Ultimate, Secret, Proven)
- Create curiosity and urgency
- Include numbers where relevant
- Appeal to Hindi/English speaking entrepreneurs
- High CTR potential

THUMBNAIL REQUIREMENTS:
- Clear, readable text (even on mobile)
- High contrast colors
- Emotional expressions if using faces
- Professional yet attention-grabbing
- Optimized for Indian audience preferences

OUTPUT:
{
  "title_options": [
    {
      "title": "Title text",
      "length": "character count",
      "keywords": ["main keywords"],
      "appeal_factor": "what makes it clickable",
      "ctr_prediction": "estimated CTR percentage"
    }
  ],
  "thumbnail_concepts": [
    {
      "concept": "Main visual idea",
      "text_overlay": "Text on thumbnail",
      "color_scheme": ["Primary", "Secondary", "Accent"],
      "visual_elements": ["Element 1", "Element 2"],
      "style": "Professional/Bold/Trending",
      "target_emotion": "Curiosity/Excitement/Urgency"
    }
  ],
  "a_b_test_variations": [
    {
      "variation_type": "Title A vs Title B",
      "hypothesis": "What we're testing",
      "expected_winner": "Prediction with reasoning"
    }
  ]
}
`;

        try {
            const response = await this.callGeminiAPI(prompt);
            return { success: true, data: JSON.parse(response) };
        } catch (error) {
            console.error('❌ Title/thumbnail generation failed:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Generate community management responses
     * @param {Array} comments - Comments to respond to
     * @returns {Object} Response suggestions
     */
    async generateCommentResponses(comments) {
        const prompt = `
आप एक professional YouTube channel के community manager हैं।

COMMENTS TO RESPOND:
${comments.map((comment, index) => `${index + 1}. "${comment.text}" - ${comment.sentiment}`).join('\n')}

RESPONSE GUIDELINES:
- Maintain friendly, professional tone
- Use Hindi/English mix naturally
- Provide value in responses
- Encourage further engagement
- Redirect to relevant content when appropriate
- Thank for positive feedback
- Address concerns constructively
- Keep responses concise (1-3 sentences)

RESPONSE TYPES:
1. Appreciation responses for positive comments
2. Helpful responses for questions
3. Constructive responses for constructive criticism
4. Professional responses for negative comments
5. Engaging responses to encourage discussion

OUTPUT:
{
  "responses": [
    {
      "comment_id": "comment reference",
      "suggested_response": "response text",
      "response_type": "appreciation/helpful/engaging",
      "tone": "friendly/professional/encouraging",
      "engagement_goal": "what we want to achieve"
    }
  ],
  "bulk_responses": {
    "thank_you_variants": ["Multiple thank you options"],
    "question_redirects": ["Responses for common questions"],
    "engagement_boosters": ["Responses to increase engagement"]
  }
}
`;

        try {
            const response = await this.callGeminiAPI(prompt);
            return { success: true, responses: JSON.parse(response) };
        } catch (error) {
            console.error('❌ Comment response generation failed:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Generate SEO-optimized descriptions
     * @param {Object} videoData - Video information
     * @returns {Object} Optimized description
     */
    async generateVideoDescription(videoData) {
        const { title, script, duration, keyPoints, resources } = videoData;

        const prompt = `
Video Title: "${title}"
Duration: ${duration} minutes
Key Points: ${keyPoints.join(', ')}

Generate comprehensive YouTube video description:

DESCRIPTION STRUCTURE:
1. Compelling opening (2-3 lines)
2. Detailed content breakdown
3. Timestamps for key sections
4. Resources and links
5. Social media links
6. Call-to-action
7. Hashtags
8. Disclaimer if needed

REQUIREMENTS:
- First 125 characters optimized for search
- Include primary and secondary keywords naturally
- Add relevant hashtags (mix of popular and niche)
- Include affiliate disclaimers where applicable
- Professional yet conversational tone
- Hindi/English mix
- SEO-optimized for Indian audience

OUTPUT:
{
  "description": "Complete formatted description",
  "seo_keywords": ["Primary keywords used"],
  "hashtags": ["Relevant hashtags"],
  "timestamps": [
    {
      "time": "00:00",
      "title": "Section title"
    }
  ],
  "call_to_actions": ["Subscribe", "Like", "Share", "Comment"],
  "character_count": "total characters"
}
`;

        try {
            const response = await this.callGeminiAPI(prompt);
            return { success: true, description: JSON.parse(response) };
        } catch (error) {
            console.error('❌ Description generation failed:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Call Gemini API with error handling and retries
     * @param {string} prompt - The prompt to send
     * @returns {string} API response
     */
    async callGeminiAPI(prompt, retries = 3) {
        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 8192,
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        };

        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const response = await fetch(
                    `${this.baseUrl}/models/${this.modelName}:generateContent?key=${this.apiKey}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestBody)
                    }
                );

                if (!response.ok) {
                    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                
                if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                    return data.candidates[0].content.parts[0].text;
                } else {
                    throw new Error('Invalid API response structure');
                }
            } catch (error) {
                console.error(`❌ Attempt ${attempt} failed:`, error.message);
                
                if (attempt === retries) {
                    throw error;
                }
                
                // Wait before retry (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
            }
        }
    }

    /**
     * Parse script response and format properly
     * @param {string} response - Raw API response
     * @returns {Object} Formatted script data
     */
    parseScriptResponse(response) {
        try {
            // Try to parse as JSON first
            const parsed = JSON.parse(response);
            return { success: true, script: parsed };
        } catch (error) {
            // If not JSON, return as formatted text
            return {
                success: true,
                script: {
                    full_script: response,
                    title_suggestions: this.extractTitles(response),
                    key_points: this.extractKeyPoints(response)
                }
            };
        }
    }

    /**
     * Extract titles from text response
     * @param {string} text - Response text
     * @returns {Array} Extracted titles
     */
    extractTitles(text) {
        const titleMatches = text.match(/title[s]?[:\-]\s*(.+)/gi);
        return titleMatches ? titleMatches.map(match => match.replace(/title[s]?[:\-]\s*/i, '').trim()) : [];
    }

    /**
     * Extract key points from text response
     * @param {string} text - Response text
     * @returns {Array} Extracted key points
     */
    extractKeyPoints(text) {
        const pointMatches = text.match(/(?:\d+\.|•|\-)\s*(.+)/g);
        return pointMatches ? pointMatches.map(match => match.replace(/(?:\d+\.|•|\-)\s*/, '').trim()) : [];
    }

    /**
     * Generate content calendar for the month
     * @param {Object} params - Calendar parameters
     * @returns {Object} Content calendar
     */
    async generateContentCalendar(params) {
        const { month, year, postingFrequency = 3, niche = 'entrepreneurship' } = params;

        const prompt = `
Generate a comprehensive content calendar for ${month} ${year}.

REQUIREMENTS:
- ${postingFrequency} videos per week
- Mix of trending and evergreen content (70% evergreen, 30% trending)
- Indian entrepreneurship focus
- Consider festivals, seasons, and business cycles
- Plan content series and standalone videos
- Include optimal posting times for Indian audience

OUTPUT:
{
  "calendar": [
    {
      "date": "YYYY-MM-DD",
      "day": "Monday",
      "content_type": "Evergreen/Trending/Series",
      "topic": "Video topic",
      "target_keywords": ["keyword1", "keyword2"],
      "content_series": "Series name (if applicable)",
      "posting_time": "HH:MM IST",
      "preparation_deadline": "YYYY-MM-DD",
      "estimated_performance": "High/Medium/Low"
    }
  ],
  "monthly_themes": ["Theme 1", "Theme 2"],
  "content_series": ["Series 1", "Series 2"],
  "seasonal_opportunities": ["Opportunity 1", "Opportunity 2"],
  "success_metrics": {
    "target_views": "monthly target",
    "target_subscribers": "growth target",
    "engagement_rate": "target percentage"
  }
}
`;

        try {
            const response = await this.callGeminiAPI(prompt);
            return { success: true, calendar: JSON.parse(response) };
        } catch (error) {
            console.error('❌ Calendar generation failed:', error.message);
            return { success: false, error: error.message };
        }
    }
}

module.exports = GeminiProAutomation;

/**
 * Example usage:
 * 
 * const gemini = new GeminiProAutomation(apiKey);
 * 
 * // Generate video script
 * const script = await gemini.generateVideoScript({
 *     topic: "Online Business कैसे शुरू करें",
 *     duration: 10,
 *     style: "educational",
 *     audience: "hindi_entrepreneurs"
 * });
 * 
 * // Generate content research
 * const research = await gemini.generateContentResearch({
 *     niche: "entrepreneurship",
 *     region: "india"
 * });
 */