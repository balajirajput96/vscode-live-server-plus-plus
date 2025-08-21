/**
 * Unified API Client for VSCode Live Server++
 * Integrates with n8n-based radial API system
 */

export interface UnifiedAPIRequest {
  type: 'ai' | 'github' | 'docs' | 'log';
  query?: string;
  message?: string;
  email?: string;
  title?: string;
  description?: string;
  context?: string;
  [key: string]: any;
}

export interface UnifiedAPIResponse {
  success: boolean;
  type: string;
  requestId: string;
  timestamp: string;
  message: string;
  aiResponse?: string;
  githubIssue?: {
    url: string;
    number: number;
  };
  document?: {
    name: string;
    mimeType: string;
  };
  error?: boolean;
  details?: string;
}

export class UnifiedAPIClient {
  private apiUrl: string;
  private defaultEmail: string;

  constructor(apiUrl?: string, defaultEmail?: string) {
    // Safely access process.env in Node.js environment
    const envApiUrl = typeof process !== 'undefined' && process.env ? process.env.N8N_UNIFIED_API_URL : '';
    this.apiUrl = apiUrl || envApiUrl || '';
    this.defaultEmail = defaultEmail || '2203456300001@paruluniversity.ac.in';
  }

  /**
   * Send request to unified API
   */
  async sendRequest(request: UnifiedAPIRequest): Promise<UnifiedAPIResponse> {
    if (!this.apiUrl) {
      throw new Error('Unified API URL not configured');
    }

    // Add default values
    const requestWithDefaults = {
      ...request,
      email: request.email || this.defaultEmail,
      timestamp: new Date().toISOString(),
      source: 'vscode-live-server-plus-plus'
    };

    try {
      // Use node-fetch or similar for Node.js environments
      // For VSCode extensions, we need to use HTTP modules
      const https = require('https');
      const http = require('http');
      const url = require('url');

      const response = await this.makeHttpRequest(this.apiUrl, requestWithDefaults);
      
      if (!response.success) {
        throw new Error(`API request failed: ${response.error || 'Unknown error'}`);
      }

      return response.data as UnifiedAPIResponse;
    } catch (error) {
      // Safe console access
      if (typeof console !== 'undefined') {
        console.error('Unified API Error:', error);
      }
      throw error;
    }
  }

  /**
   * Make HTTP request using Node.js built-in modules
   */
  private makeHttpRequest(apiUrl: string, data: any): Promise<{ success: boolean; data?: any; error?: string }> {
    return new Promise((resolve) => {
      try {
        const https = require('https');
        const http = require('http');
        const urlModule = require('url');
        
        const parsedUrl = urlModule.parse(apiUrl);
        const postData = JSON.stringify(data);
        
        const options = {
          hostname: parsedUrl.hostname,
          port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
          path: parsedUrl.path,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
            'User-Agent': 'VSCode-Live-Server-Plus-Plus'
          }
        };

        const client = parsedUrl.protocol === 'https:' ? https : http;
        
        const req = client.request(options, (res: any) => {
          let responseData = '';
          
          res.on('data', (chunk: any) => {
            responseData += chunk;
          });
          
          res.on('end', () => {
            try {
              const jsonResponse = JSON.parse(responseData);
              resolve({ success: true, data: jsonResponse });
            } catch (parseError) {
              resolve({ success: false, error: 'Failed to parse response' });
            }
          });
        });

        req.on('error', (error: any) => {
          resolve({ success: false, error: error.message });
        });

        req.setTimeout(30000, () => {
          req.abort();
          resolve({ success: false, error: 'Request timeout' });
        });

        req.write(postData);
        req.end();
      } catch (error) {
        resolve({ success: false, error: (error as Error).message });
      }
    });
  }

  /**
   * Send AI query for assistance
   */
  async askAI(query: string, context?: string): Promise<string> {
    const response = await this.sendRequest({
      type: 'ai',
      query,
      context: context || 'VSCode Live Server++ assistance'
    });

    if (response.success && response.aiResponse) {
      return response.aiResponse;
    }

    throw new Error(response.message || 'AI request failed');
  }

  /**
   * Create GitHub issue
   */
  async createGitHubIssue(title: string, description: string, labels?: string[]): Promise<{ url: string; number: number }> {
    const response = await this.sendRequest({
      type: 'github',
      title,
      description,
      labels: labels || ['automation', 'vscode-extension']
    });

    if (response.success && response.githubIssue) {
      return response.githubIssue;
    }

    throw new Error(response.message || 'GitHub issue creation failed');
  }

  /**
   * Log data for analytics
   */
  async logData(message: string, category?: string, additionalData?: any): Promise<void> {
    await this.sendRequest({
      type: 'log',
      message,
      category: category || 'vscode-activity',
      data: additionalData
    });
  }

  /**
   * Get documentation from Google Drive
   */
  async getDocumentation(fileId?: string): Promise<any> {
    const response = await this.sendRequest({
      type: 'docs',
      file_id: fileId || 'default-docs',
      operation: 'download'
    });

    if (response.success && response.document) {
      return response.document;
    }

    throw new Error(response.message || 'Documentation retrieval failed');
  }

  /**
   * Health check for API availability
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.sendRequest({
        type: 'log',
        message: 'VSCode extension health check',
        category: 'health-check'
      });

      return response.success;
    } catch (error) {
      // Safe console access
      if (typeof console !== 'undefined') {
        console.warn('Unified API health check failed:', error);
      }
      return false;
    }
  }

  /**
   * Configure API settings
   */
  setApiUrl(url: string): void {
    this.apiUrl = url;
  }

  setDefaultEmail(email: string): void {
    this.defaultEmail = email;
  }

  /**
   * Get current configuration
   */
  getConfig(): { apiUrl: string; defaultEmail: string } {
    return {
      apiUrl: this.apiUrl,
      defaultEmail: this.defaultEmail
    };
  }
}

// Helper functions for common operations

/**
 * Auto-report errors to unified API
 */
export async function reportError(error: Error, context: string, apiClient?: UnifiedAPIClient): Promise<void> {
  if (!apiClient) {
    return;
  }

  try {
    await apiClient.createGitHubIssue(
      `VSCode Extension Error: ${error.name}`,
      `## Error Report\n\n**Context:** ${context}\n\n**Error Message:** ${error.message}\n\n**Stack Trace:**\n\`\`\`\n${error.stack}\n\`\`\`\n\n**Timestamp:** ${new Date().toISOString()}\n\n*Auto-generated by VSCode Live Server++*`,
      ['bug', 'auto-generated', 'vscode-extension']
    );
  } catch (reportError) {
    if (typeof console !== 'undefined') {
      console.error('Failed to report error via unified API:', reportError);
    }
  }
}

/**
 * Auto-log user actions for analytics
 */
export async function logUserAction(action: string, details?: any, apiClient?: UnifiedAPIClient): Promise<void> {
  if (!apiClient) {
    return;
  }

  try {
    await apiClient.logData(
      `User action: ${action}`,
      'user-activity',
      {
        action,
        details,
        timestamp: new Date().toISOString(),
        userAgent: 'VSCode Extension'
      }
    );
  } catch (error) {
    if (typeof console !== 'undefined') {
      console.warn('Failed to log user action:', error);
    }
  }
}

/**
 * Get AI-powered help for VSCode extension features
 */
export async function getAIHelp(query: string, feature?: string, apiClient?: UnifiedAPIClient): Promise<string> {
  if (!apiClient) {
    throw new Error('Unified API client not available');
  }

  const context = feature ? `VSCode Live Server++ feature: ${feature}` : 'VSCode Live Server++ general help';
  return await apiClient.askAI(query, context);
}

// Export singleton instance for global use
export const globalUnifiedAPI = new UnifiedAPIClient();

// Auto-configure from environment if available (Node.js only)
if (typeof process !== 'undefined' && process.env) {
  if (process.env.N8N_UNIFIED_API_URL) {
    globalUnifiedAPI.setApiUrl(process.env.N8N_UNIFIED_API_URL);
  }
  if (process.env.DEFAULT_EMAIL) {
    globalUnifiedAPI.setDefaultEmail(process.env.DEFAULT_EMAIL);
  }
}