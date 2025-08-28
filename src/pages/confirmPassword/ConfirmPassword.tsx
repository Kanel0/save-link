"use client";

import { ButtonPrimary } from '@/components/button/Button';
import Title from '@/components/title/Title';
import Input from "@/components/input/Input";
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcLock } from 'react-icons/fc';
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "@/lib/firebase";

function ConfirmPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Récupérer oobCode depuis l'URL
  const oobCode = searchParams?.get("oobCode");

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [codeValid, setCodeValid] = useState<boolean | null>(null);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Vérifier la validité du code au chargement
  useEffect(() => {
    const verifyCode = async () => {
      if (!oobCode) {
        setError("Lien de réinitialisation invalide ou manquant.");
        setCodeValid(false);
        return;
      }

      try {
        // Vérifier le code et récupérer l'email
        const userEmail = await verifyPasswordResetCode(auth, oobCode);
        setEmail(userEmail);
        setCodeValid(true);
      } catch (err: any) {
        console.error("Erreur de vérification du code:", err);
        let errorMessage = "Lien de réinitialisation invalide ou expiré.";
        
        switch (err.code) {
          case 'auth/expired-action-code':
            errorMessage = "Ce lien de réinitialisation a expiré. Veuillez demander un nouveau lien.";
            break;
          case 'auth/invalid-action-code':
            errorMessage = "Ce lien de réinitialisation est invalide.";
            break;
          case 'auth/user-disabled':
            errorMessage = "Ce compte utilisateur a été désactivé.";
            break;
          case 'auth/user-not-found':
            errorMessage = "Aucun utilisateur trouvé pour cette demande de réinitialisation.";
            break;
          default:
            errorMessage = `Erreur: ${err.message}`;
        }
        
        setError(errorMessage);
        setCodeValid(false);
      }
    };

    verifyCode();
  }, [oobCode]);

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return "Le mot de passe doit contenir au moins 6 caractères.";
    }
    return null;
  };

  const handleResetPassword = async () => {
    // Réinitialiser les messages
    setError("");
    setSuccess("");

    if (!oobCode) {
      setError("Lien de réinitialisation invalide ou expiré.");
      return;
    }

    // Validation du mot de passe
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      setLoading(true);
      await confirmPasswordReset(auth, oobCode, password);
      setSuccess("Mot de passe réinitialisé avec succès ! Redirection vers la page de connexion...");
      
      // Redirection après succès
      setTimeout(() => {
        router.push("/login");
      }, 3000);
      
    } catch (err: any) {
      console.error("Erreur lors de la réinitialisation:", err);
      
      let errorMessage = "Erreur lors de la réinitialisation du mot de passe.";
      
      switch (err.code) {
        case 'auth/expired-action-code':
          errorMessage = "Ce lien de réinitialisation a expiré. Veuillez demander un nouveau lien.";
          break;
        case 'auth/invalid-action-code':
          errorMessage = "Ce lien de réinitialisation est invalide.";
          break;
        case 'auth/user-disabled':
          errorMessage = "Ce compte utilisateur a été désactivé.";
          break;
        case 'auth/user-not-found':
          errorMessage = "Aucun utilisateur trouvé.";
          break;
        case 'auth/weak-password':
          errorMessage = "Le mot de passe est trop faible.";
          break;
        default:
          errorMessage = `Erreur: ${err.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Affichage de chargement pendant la vérification du code
  if (codeValid === null) {
    return (
      <div className="flex justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen w-full items-center px-4 py-6 sm:py-8">
        <div className="group bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl p-4 sm:p-8 rounded-lg shadow-2xl w-full max-w-md mx-auto">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
            <span className="ml-4 text-white">Vérification du lien...</span>
          </div>
        </div>
      </div>
    );
  }

  // Si le code n'est pas valide, afficher une erreur avec option de retour
  if (codeValid === false) {
    return (
      <div className="flex justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen w-full items-center px-4 py-6 sm:py-8">
        <div className="group bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl p-4 sm:p-8 rounded-lg shadow-2xl w-full max-w-md mx-auto">
          
          {/* Logo */}
          <div
            onClick={() => router.push("/")}
            className="flex cursor-pointer text-5xl justify-center mb-6"
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
              SaveLink
            </span>
          </div>

          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <Title type="h3" variant="secondary" className="mb-4">
              Lien invalide
            </Title>
            <p className="text-red-500 text-sm mb-6">{error}</p>
            
            <ButtonPrimary
              className="w-full py-2.5 text-sm mb-4"
              onClick={() => router.push("/forgot-password")}
            >
              Demander un nouveau lien
            </ButtonPrimary>
            
            <ButtonPrimary
              className="w-full py-2.5 text-sm bg-gray-600 hover:bg-gray-700"
              onClick={() => router.push("/login")}
            >
              Retour à la connexion
            </ButtonPrimary>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen w-full items-center px-4 py-6 sm:py-8">
      <div className="group bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl p-4 sm:p-8 rounded-lg shadow-2xl w-full max-w-md mx-auto">

        {/* Logo */}
        <div
          onClick={() => router.push("/")}
          className="flex cursor-pointer text-5xl justify-center mb-6"
        >
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
            SaveLink
          </span>
        </div>

        {/* Title */}
        <div className="flex justify-center mb-2">
          <Title type="h3" variant="secondary" className="flex items-center">
            Réinitialiser le mot de passe
            <FcLock className="ml-2 text-2xl" />
          </Title>
        </div>

        {/* Email Info */}
        {email && (
          <div className="mb-6 p-3 bg-blue-900/30 rounded-lg border border-blue-700/50">
            <p className="text-blue-300 text-sm">
              <span className="font-medium">Email :</span> {email}
            </p>
          </div>
        )}

        {/* New Password */}
        <div className="mb-6">
          <p className="text-gray-500 mb-2 text-sm">Nouveau mot de passe</p>
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 6 caractères"
            icon={
              showPassword ? (
                <FaEye onClick={togglePasswordVisibility} className="cursor-pointer text-gray-500 text-xl" />
              ) : (
                <FaEyeSlash onClick={togglePasswordVisibility} className="cursor-pointer text-gray-500 text-xl" />
              )
            }
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <p className="text-gray-500 mb-2 text-sm">Confirmer le mot de passe</p>
          <Input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmer le mot de passe"
            icon={
              showPassword ? (
                <FaEye onClick={togglePasswordVisibility} className="cursor-pointer text-gray-500 text-xl" />
              ) : (
                <FaEyeSlash onClick={togglePasswordVisibility} className="cursor-pointer text-gray-500 text-xl" />
              )
            }
          />
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/30 rounded-lg border border-red-700/50">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-900/30 rounded-lg border border-green-700/50">
            <p className="text-green-300 text-sm">{success}</p>
          </div>
        )}

        {/* Button */}
        <div className="mb-8">
          <ButtonPrimary
            className="w-full py-2.5 text-sm"
            onClick={handleResetPassword}
            disabled={loading || !password || !confirmPassword}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Réinitialisation...
              </div>
            ) : (
              'Confirmer le nouveau mot de passe'
            )}
          </ButtonPrimary>
        </div>

        {/* Back to Login */}
        <div className="text-center">
          <button
            onClick={() => router.push("/login")}
            className="text-[#7367f0] text-sm hover:underline transition-colors duration-200 hover:text-[#5e52e6]"
          >
            Retour à la connexion
          </button>
        </div>

      </div>
    </div>
  );
}

export default ConfirmPasswordPage;