import * as fs from 'fs';
import * as path from 'path';

let cachedInjectedText: string | null = null;

export const getInjectedText = () => {
  if (cachedInjectedText !== null) return cachedInjectedText;
  cachedInjectedText = fs.readFileSync(
    path.join(__dirname, '../assets/inject.html'),
    {
      encoding: 'utf-8'
    }
  );
  return cachedInjectedText;
};
