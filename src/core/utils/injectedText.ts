import * as fs from 'fs';
import * as path from 'path';

// Cache for injected text to avoid repeated file system calls
let injectedTextCache: string | null = null;

export const getInjectedText = (): string => {
  if (injectedTextCache) {
    return injectedTextCache;
  }
  
  try {
    injectedTextCache = fs.readFileSync(
      path.join(__dirname, '../assets/inject.html'),
      { encoding: 'utf-8' }
    );
    return injectedTextCache;
  } catch (error) {
    console.warn('Failed to load injected text:', error);
    return '';
  }
};

// Legacy export for backward compatibility
export const INJECTED_TEXT = getInjectedText();
