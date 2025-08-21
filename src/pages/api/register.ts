import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';
import { writeLog } from '@/utils/writeLog';

// Définir le type de l'utilisateur
interface User {
  id: string;
  username: string;
  email: string;
  password: string;
}

const usersFilePath = path.join(process.cwd(), 'src/models/user/user.json');  
const logFilePath = path.join(process.cwd(), 'src/logs/app.log');  

// Vérifier si les fichiers existent, sinon les créer
if (!fs.existsSync(usersFilePath)) fs.writeFileSync(usersFilePath, '[]'); 
if (!fs.existsSync(logFilePath)) fs.writeFileSync(logFilePath, ''); 



// Fonction pour lire les utilisateurs depuis le fichier JSON
const readUsersFromFile = (): User[] => {
  try {
    const fileData = fs.readFileSync(usersFilePath, 'utf-8');
    return JSON.parse(fileData);
  } catch (err) {
    console.error('Error reading users file:', err);
    return [];
  }
};

// Fonction pour sauvegarder les utilisateurs dans le fichier JSON
const saveUsersToFile = (users: User[]) => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('Error saving users to file:', err);
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, email, password } = req.body;

    // Vérifier si tous les champs sont remplis
    if (!username || !email || !password) {
      writeLog('Échec de validation: champs manquants.');
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    // Lire les utilisateurs existants
    const users: User[] = readUsersFromFile();

    // Vérifier si l'email existe déjà
    if (users.some((user) => user.email === email)) {
      writeLog(`Échec création: email déjà utilisé (${email})`);
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Vérifier si le username existe déjà
    if (users.some((user) => user.username === username)) {
      writeLog(`Échec création: username déjà pris (${username})`);
      return res.status(400).json({ message: 'Ce nom d\'utilisateur est déjà pris' });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer le nouvel utilisateur
    const newUser: User = {
      id: nanoid(),
      username,
      email,
      password: hashedPassword,
    };

    // Ajouter l'utilisateur et sauvegarder
    users.push(newUser);
    saveUsersToFile(users);

    writeLog(`Utilisateur créé: ${username} (${email})`);
    return res.status(201).json({ message: 'Utilisateur créé avec succès', user: newUser });

  } else {
    writeLog(`Méthode non autorisée: ${req.method}`);
    res.status(405).json({ message: 'Méthode non autorisée' });
  }
}