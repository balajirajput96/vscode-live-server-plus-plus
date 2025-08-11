/**
 * Retry utility with exponential backoff
 */

const { logger } = require('./logger');

async function withRetry(fn, maxRetries = 3, operation = 'operation', baseDelay = 1000) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const result = await fn();
            if (attempt > 1) {
                logger.info(`${operation} succeeded on attempt ${attempt}`);
            }
            return result;
        } catch (error) {
            lastError = error;
            
            if (attempt === maxRetries) {
                logger.error(`${operation} failed after ${maxRetries} attempts:`, { 
                    error: error.message,
                    stack: error.stack 
                });
                break;
            }

            const delay = baseDelay * Math.pow(2, attempt - 1); // Exponential backoff
            logger.warn(`${operation} failed on attempt ${attempt}, retrying in ${delay}ms:`, { 
                error: error.message 
            });
            
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    
    throw lastError;
}

async function withTimeout(fn, timeoutMs = 30000, operation = 'operation') {
    return new Promise(async (resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error(`${operation} timed out after ${timeoutMs}ms`));
        }, timeoutMs);

        try {
            const result = await fn();
            clearTimeout(timeout);
            resolve(result);
        } catch (error) {
            clearTimeout(timeout);
            reject(error);
        }
    });
}

module.exports = { withRetry, withTimeout };