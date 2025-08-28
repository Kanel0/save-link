'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FcLock } from 'react-icons/fc';
import Input from '@/components/input/Input';
import { IoIosArrowBack } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import { ButtonPrimary } from '@/components/button/Button';
import Link from 'next/link';
import Title from '@/components/title/Title';
import Modal from '@/components/modals/Modal';

// Firebase imports
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // États pour les modals
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Validation email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation côté client
    if (!email) {
      setModalMessage('Veuillez entrer votre adresse email.');
      setIsErrorModalOpen(true);
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setModalMessage('Veuillez entrer une adresse email valide.');
      setIsErrorModalOpen(true);
      setIsLoading(false);
      return;
    }

    try {
      // Configuration pour l'email de réinitialisation
      const actionCodeSettings = {
        // URL de redirection après clic sur le lien
        url: `${window.location.origin}/confirm-password`,
        handleCodeInApp: false, // Le lien s'ouvrira dans le navigateur, pas dans l'app
      };

      // Envoyer l'email de réinitialisation
      await sendPasswordResetEmail(auth, email, actionCodeSettings);

      setModalMessage(
        `Un email de réinitialisation a été envoyé à ${email}. ` +
        'Vérifiez votre boîte de réception et vos spams. ' +
        'Le lien sera valide pendant 1 heure.'
      );
      setIsSuccessModalOpen(true);
      setEmail(''); 

    } catch (error: any) {
      console.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', error);
      
      let message = 'Erreur lors de l\'envoi de l\'email de réinitialisation.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          message = 'Aucun compte trouvé avec cette adresse email.';
          break;
        case 'auth/invalid-email':
          message = 'Adresse email invalide.';
          break;
        case 'auth/too-many-requests':
          message = 'Trop de tentatives. Veuillez réessayer plus tard.';
          break;
        case 'auth/network-request-failed':
          message = 'Erreur de connexion. Vérifiez votre connexion internet.';
          break;
        case 'auth/quota-exceeded':
          message = 'Quota d\'emails dépassé. Veuillez réessayer plus tard.';
          break;
        default:
          message = `Erreur: ${error.message}`;
      }

      setModalMessage(message);
      setIsErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* ✅ MODAL SUCCESS */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          // Ne pas rediriger automatiquement, laisser l'utilisateur choisir
        }}
        title="Email envoyé ✅"
      >
        <div className="text-gray-800">
          <p className="mb-4">{modalMessage}</p>
          <div className="flex gap-2">
            <ButtonPrimary
              onClick={() => {
                setIsSuccessModalOpen(false);
                router.push('/login');
              }}
              className="flex-1 py-2 text-sm"
            >
              Retour à la connexion
            </ButtonPrimary>
            <ButtonPrimary
              onClick={() => setIsSuccessModalOpen(false)}
              className="flex-1 py-2 text-sm bg-gray-600 hover:bg-gray-700"
            >
              Fermer
            </ButtonPrimary>
          </div>
        </div>
      </Modal>

      {/* ❌ MODAL ERROR */}
      <Modal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        title="Erreur ❌"
      >
        <p className="text-gray-800">{modalMessage}</p>
      </Modal>

      <div className="flex justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen w-full items-center px-4 py-6 sm:py-8">
        <form 
          onSubmit={handleSubmit}
          className="group bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl p-4 sm:p-8 rounded-lg shadow-2xl w-full max-w-md mx-auto"
        >
          {/* Logo */}
          <div
            onClick={() => router.push("/")}
            className="flex cursor-pointer text-5xl sm:text-6xl md:text-7xl lg:text-8xl justify-center mb-6"
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
              SaveLink
            </span>
          </div>

          {/* Title */}
          <div className="flex justify-center sm:justify-start mb-2">
            <Title 
              type="h3" 
              variant="secondary" 
              className="flex items-center text-center sm:text-left"
            >
              Mot de passe oublié ?
              <FcLock className="ml-2 text-2xl sm:text-3xl" />
            </Title>
          </div>

          {/* Description */}
          <div className="text-gray-500 text-sm sm:text-base mb-6 sm:text-left">
            Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </div>

          {/* Email Field */}
          <div className="mb-6">
            <p className="text-gray-500 mb-2 text-sm sm:text-base">Email</p>
            <Input
              type="email"
              placeholder="Entrez votre adresse email"
              className="w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Button */}
          <div className="mb-8">
            <ButtonPrimary 
              type="submit" 
              className="w-full py-2.5 text-sm sm:text-base"
              disabled={isLoading || !email}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Send
                </div>
              ) : (
                'Envoyer le lien de réinitialisation'
              )}
            </ButtonPrimary>
          </div>

          {/* Back to Login Link */}
          <div className="flex justify-center">
            <Link href="/login" 
              className="text-[#7367f0] text-sm sm:text-base hover:underline no-underline flex items-center transition-colors duration-200 hover:text-[#5e52e6]"
            >
              <IoIosArrowBack className="mr-2 text-xl sm:text-2xl" />
              Back to login
            </Link>
          </div>

          {/* Info supplémentaire */}
          <div className="mt-6 p-3 bg-blue-900/20 rounded-lg border border-blue-700/30">
            <p className="text-blue-300 text-xs sm:text-sm text-center">
              💡 Astuce : Vérifiez aussi votre dossier spam si vous ne recevez pas l'email dans les 5 minutes.
            </p>
          </div>
        </form>
      </div>
    </>
  );
}

export default ForgotPasswordPage;