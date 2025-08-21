import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { writeLog } from '@/utils/writeLog';

interface User {
  id: number;
  email: string;
  password: string;
}

// Définir le chemin du fichier JSON contenant les utilisateurs
const usersFilePath = path.join(process.cwd(), 'src/models/user/user.json');    
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey'; 




// Fonction pour lire le fichier JSON des utilisateurs
const readUsersFromFile = (): Promise<User[]> => {
  return new Promise((resolve, reject) => {
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
      if (err) {
        return reject('Error reading users file');
      }
      try {
        const users = JSON.parse(data);
        resolve(users);
      } catch (error) {
        reject(`Error parsing users file : ${error}`);
      }
    });
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Vérification des champs
    if (!email || !password) {
      writeLog('Login failed: Missing fields');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
      // Lire les utilisateurs depuis le fichier JSON
      const users = await readUsersFromFile();

      // Recherche de l'utilisateur dans la liste
      const user = users.find((user) => user.email === email);

      if (!user) {
        writeLog(`Login failed: User not found (${email})`);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Vérification du mot de passe
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        writeLog(`Login failed: Incorrect password for (${email})`);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Génération du token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '2h' } // Expiration dans 2 heures
      );

      // Authentification réussie
      writeLog(`Login successful: ${email}`);
      return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      writeLog(`Login error: ${error}`);
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    writeLog(`Invalid request method: ${req.method}`);
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}