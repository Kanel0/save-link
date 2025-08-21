import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';  
import fs from 'fs';

const logFilePath = path.join(process.cwd(), 'src/logs/app.log');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Supprimer le token JWT côté client en supprimant le cookie
      res.setHeader('Set-Cookie', 'token=; Max-Age=0; path=/; HttpOnly; SameSite=Strict; Secure');
      
      // Log de la déconnexion
      const timestamp = new Date().toISOString();
      const logMessage = `[${timestamp}] Logout successful\n`;
      fs.appendFileSync(logFilePath, logMessage); // Écriture dans les logs (si nécessaire)

      // Répondre que la déconnexion a réussi
      return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      console.error('Error during logout:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}