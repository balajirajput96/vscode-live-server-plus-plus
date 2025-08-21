/**
 * 🎤 Voice AI Agent System
 * Advanced voice-activated automation for career management
 * 
 * Features:
 * - Speech-to-Text (Hindi/English support)
 * - LLM-powered command understanding
 * - Text-to-Speech responses
 * - Workflow automation integration
 * - n8n webhook integration
 */

class VoiceAIAgent {
    constructor(config = {}) {
        this.config = {
            // STT Configuration
            sttService: config.sttService || 'webSpeech', // 'webSpeech', 'openai', 'google'
            language: config.language || 'hi-IN', // Hindi by default
            
            // LLM Configuration
            llmProvider: config.llmProvider || 'openai', // 'openai', 'gemini'
            model: config.model || 'gpt-4o',
            
            // TTS Configuration
            ttsService: config.ttsService || 'speechSynthesis', // 'speechSynthesis', 'elevenlabs', 'openai'
            voice: config.voice || 'hi-IN-Standard-A',
            
            // n8n Integration
            n8nWebhookUrl: config.n8nWebhookUrl || null,
            
            // API Keys (should be set via environment variables)
            openaiApiKey: config.openaiApiKey || null,
            elevenlabsApiKey: config.elevenlabsApiKey || null,
            
            ...config
        };

        this.isListening = false;
        this.conversationHistory = [];
        this.recognition = null;
        this.synthesis = null;
        
        this.initializeServices();
    }

    /**
     * Initialize speech recognition and synthesis services
     */
    initializeServices() {
        // Initialize Speech Recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = this.config.language;
            
            this.setupRecognitionHandlers();
        }

        // Initialize Speech Synthesis
        if ('speechSynthesis' in window) {
            this.synthesis = window.speechSynthesis;
        }
    }

    /**
     * Setup speech recognition event handlers
     */
    setupRecognitionHandlers() {
        this.recognition.onstart = () => {
            this.isListening = true;
            this.onListeningStart();
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.onListeningEnd();
        };

        this.recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            if (finalTranscript) {
                this.processVoiceCommand(finalTranscript);
            }

            this.onTranscription(finalTranscript, interimTranscript);
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.onError(event.error);
        };
    }

    /**
     * Start listening for voice commands
     */
    startListening() {
        if (this.recognition && !this.isListening) {
            try {
                this.recognition.start();
            } catch (error) {
                console.error('Error starting speech recognition:', error);
            }
        }
    }

    /**
     * Stop listening for voice commands
     */
    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }

    /**
     * Process voice command through LLM
     * @param {string} transcript - The transcribed speech
     */
    async processVoiceCommand(transcript) {
        try {
            // Add to conversation history
            this.conversationHistory.push({
                role: 'user',
                content: transcript,
                timestamp: new Date().toISOString()
            });

            // Send to LLM for understanding and action planning
            const response = await this.sendToLLM(transcript);
            
            // Process LLM response
            await this.handleLLMResponse(response);
            
        } catch (error) {
            console.error('Error processing voice command:', error);
            this.speak('माफ़ करें, आपके कमांड को प्रोसेस करने में कोई समस्या हुई है।');
        }
    }

    /**
     * Send transcript to LLM for processing
     * @param {string} transcript - User's voice input
     * @returns {Object} LLM response
     */
    async sendToLLM(transcript) {
        const prompt = this.buildLLMPrompt(transcript);
        
        if (this.config.llmProvider === 'openai') {
            return await this.callOpenAI(prompt);
        } else if (this.config.llmProvider === 'gemini') {
            return await this.callGemini(prompt);
        }
        
        throw new Error('Unsupported LLM provider');
    }

    /**
     * Build prompt for LLM with function calling
     * @param {string} transcript - User input
     * @returns {Object} Formatted prompt
     */
    buildLLMPrompt(transcript) {
        const systemPrompt = `आप एक हिंदी-भाषी AI असिस्टेंट हैं जो career automation में मदद करते हैं। 
        आप निम्नलिखित कार्य कर सकते हैं:
        1. LinkedIn पोस्ट बनाना
        2. Resume optimize करना  
        3. Job applications track करना
        4. Portfolio content generate करना
        5. Social media posts create करना
        
        User का command समझकर appropriate function call करें या direct response दें।`;

        return {
            messages: [
                { role: 'system', content: systemPrompt },
                ...this.conversationHistory.slice(-5), // Last 5 messages for context
                { role: 'user', content: transcript }
            ],
            functions: this.getFunctionDefinitions(),
            function_call: 'auto'
        };
    }

    /**
     * Get function definitions for LLM
     * @returns {Array} Function definitions
     */
    getFunctionDefinitions() {
        return [
            {
                name: 'generate_linkedin_post',
                description: 'Create a professional LinkedIn post',
                parameters: {
                    type: 'object',
                    properties: {
                        topic: { type: 'string', description: 'Post topic or content' },
                        tone: { type: 'string', enum: ['professional', 'casual', 'enthusiastic'] },
                        hashtags: { type: 'array', items: { type: 'string' } }
                    },
                    required: ['topic']
                }
            },
            {
                name: 'optimize_resume',
                description: 'Optimize resume content for specific role/company',
                parameters: {
                    type: 'object',
                    properties: {
                        content: { type: 'string', description: 'Resume content to optimize' },
                        targetRole: { type: 'string', description: 'Target job role' },
                        company: { type: 'string', description: 'Target company' }
                    },
                    required: ['content']
                }
            },
            {
                name: 'track_job_application',
                description: 'Add or update job application status',
                parameters: {
                    type: 'object',
                    properties: {
                        company: { type: 'string', description: 'Company name' },
                        position: { type: 'string', description: 'Job position' },
                        status: { type: 'string', enum: ['applied', 'interview', 'rejected', 'offered'] },
                        notes: { type: 'string', description: 'Additional notes' }
                    },
                    required: ['company', 'position', 'status']
                }
            },
            {
                name: 'send_to_n8n',
                description: 'Send data to n8n workflow for automation',
                parameters: {
                    type: 'object',
                    properties: {
                        workflow: { type: 'string', description: 'Workflow type' },
                        data: { type: 'object', description: 'Data to send' }
                    },
                    required: ['workflow', 'data']
                }
            }
        ];
    }

    /**
     * Call OpenAI API
     * @param {Object} prompt - Formatted prompt
     * @returns {Object} API response
     */
    async callOpenAI(prompt) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.openaiApiKey}`
            },
            body: JSON.stringify({
                model: this.config.model,
                messages: prompt.messages,
                functions: prompt.functions,
                function_call: prompt.function_call,
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        return await response.json();
    }

    /**
     * Handle LLM response and execute functions
     * @param {Object} response - LLM response
     */
    async handleLLMResponse(response) {
        const message = response.choices[0].message;

        if (message.function_call) {
            // Execute function call
            await this.executeFunction(message.function_call);
        } else if (message.content) {
            // Direct response
            this.speak(message.content);
            this.conversationHistory.push({
                role: 'assistant',
                content: message.content,
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Execute function based on LLM's decision
     * @param {Object} functionCall - Function call object
     */
    async executeFunction(functionCall) {
        const { name, arguments: args } = functionCall;
        const parsedArgs = JSON.parse(args);

        let result = '';

        switch (name) {
            case 'generate_linkedin_post':
                result = await this.generateLinkedInPost(parsedArgs);
                break;
            case 'optimize_resume':
                result = await this.optimizeResume(parsedArgs);
                break;
            case 'track_job_application':
                result = await this.trackJobApplication(parsedArgs);
                break;
            case 'send_to_n8n':
                result = await this.sendToN8n(parsedArgs);
                break;
            default:
                result = 'माफ़ करें, यह function अभी उपलब्ध नहीं है।';
        }

        this.speak(result);
    }

    /**
     * Generate LinkedIn post
     * @param {Object} args - Function arguments
     * @returns {string} Result message
     */
    async generateLinkedInPost(args) {
        const { topic, tone = 'professional', hashtags = [] } = args;
        
        // Integrate with existing portfolio system
        const postContent = `🚀 ${topic}

🔬 बायोइन्फॉर्मेटिक्स और डेटा एनालिसिस के क्षेत्र में काम करते हुए, मैंने यह महत्वपूर्ण सीख प्राप्त की है।

${hashtags.length > 0 ? hashtags.map(tag => `#${tag}`).join(' ') : '#Bioinformatics #DataAnalysis #Biotechnology #Python'}`;

        // Save to local storage
        const posts = JSON.parse(localStorage.getItem('socialPosts')) || [];
        posts.push({
            platform: 'linkedin',
            content: postContent,
            createdAt: new Date().toISOString(),
            generatedBy: 'voice'
        });
        localStorage.setItem('socialPosts', JSON.stringify(posts));

        return `LinkedIn पोस्ट सफलतापूर्वक बनाया गया। Topic: ${topic}`;
    }

    /**
     * Optimize resume content
     * @param {Object} args - Function arguments
     * @returns {string} Result message
     */
    async optimizeResume(args) {
        const { content, targetRole, company } = args;
        
        // This would integrate with existing resume optimization
        return `Resume को ${targetRole} पोजीशन के लिए optimize किया गया${company ? ` ${company} कंपनी में` : ''}।`;
    }

    /**
     * Track job application
     * @param {Object} args - Function arguments
     * @returns {string} Result message
     */
    async trackJobApplication(args) {
        const { company, position, status, notes } = args;
        
        // Save to job tracking system
        const applications = JSON.parse(localStorage.getItem('jobApplications')) || [];
        applications.push({
            company,
            position,
            status,
            notes,
            appliedDate: new Date().toISOString(),
            addedBy: 'voice'
        });
        localStorage.setItem('jobApplications', JSON.stringify(applications));

        return `${company} में ${position} पोजीशन के लिए application status "${status}" के रूप में add किया गया।`;
    }

    /**
     * Send data to n8n workflow
     * @param {Object} args - Function arguments
     * @returns {string} Result message
     */
    async sendToN8n(args) {
        if (!this.config.n8nWebhookUrl) {
            return 'n8n webhook URL configure नहीं है।';
        }

        try {
            const response = await fetch(this.config.n8nWebhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...args,
                    timestamp: new Date().toISOString(),
                    source: 'voice-agent'
                })
            });

            if (response.ok) {
                return 'n8n workflow को सफलतापूर्वक data भेजा गया।';
            } else {
                return 'n8n workflow में data भेजने में समस्या हुई।';
            }
        } catch (error) {
            console.error('n8n webhook error:', error);
            return 'n8n connection में समस्या हुई।';
        }
    }

    /**
     * Speak text using TTS
     * @param {string} text - Text to speak
     */
    speak(text) {
        if (this.config.ttsService === 'speechSynthesis' && this.synthesis) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = this.config.language;
            utterance.rate = 0.9;
            utterance.pitch = 1;
            
            // Try to use Hindi voice if available
            const voices = this.synthesis.getVoices();
            const hindiVoice = voices.find(voice => voice.lang.includes('hi'));
            if (hindiVoice) {
                utterance.voice = hindiVoice;
            }
            
            this.synthesis.speak(utterance);
        }
    }

    /**
     * Event handlers (to be overridden)
     */
    onListeningStart() {
        console.log('Voice AI Agent: Listening started');
    }

    onListeningEnd() {
        console.log('Voice AI Agent: Listening ended');
    }

    onTranscription(final, interim) {
        console.log('Transcription - Final:', final, 'Interim:', interim);
    }

    onError(error) {
        console.error('Voice AI Agent Error:', error);
    }

    /**
     * Get conversation history
     * @returns {Array} Conversation history
     */
    getConversationHistory() {
        return this.conversationHistory;
    }

    /**
     * Clear conversation history
     */
    clearHistory() {
        this.conversationHistory = [];
    }

    /**
     * Update configuration
     * @param {Object} newConfig - New configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VoiceAIAgent;
}

// Make available globally
if (typeof window !== 'undefined') {
    window.VoiceAIAgent = VoiceAIAgent;
}

/**
 * Example usage:
 * 
 * const voiceAgent = new VoiceAIAgent({
 *     language: 'hi-IN',
 *     openaiApiKey: 'your-openai-key',
 *     n8nWebhookUrl: 'https://your-n8n-instance.com/webhook/voice-agent'
 * });
 * 
 * // Start listening
 * voiceAgent.startListening();
 * 
 * // Stop listening
 * voiceAgent.stopListening();
 * 
 * // Process text directly
 * voiceAgent.processVoiceCommand('मेरे लिए एक LinkedIn post बनाओ Python project के बारे में');
 */