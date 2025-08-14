import fs from 'fs';
import path from 'path';

// Directory of the log file
const logFilePath = path.join(process.cwd(), 'src/logs/app.log');  

export const writeLog = (message: string) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('Error writing log:', err);
    }
  });
};