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
  const validateEmail = (email : any) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e : any) => {
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
      // Envoyer l'email de réinitialisation
      await sendPasswordResetEmail(auth, email, {
        // Configuration optionnelle pour personnaliser l'email
        url: `${window.location.origin}/login`, // URL de redirection après reset
        handleCodeInApp: false
      });

      setModalMessage('Un email de réinitialisation a été envoyé à votre adresse email. Vérifiez votre boîte de réception (et vos spams).');
      setIsSuccessModalOpen(true);
      setEmail(''); // Clear le champ email
      setIsLoading(false);

    } catch (error : any) {
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
        default:
          message = `Erreur: ${error.message}`;
      }

      setModalMessage(message);
      setIsErrorModalOpen(true);
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
          router.push('/login'); // Redirection vers login après succès
        }}
        title="Email envoyé"
      >
        <p className="text-gray-800">{modalMessage}</p>
      </Modal>

      {/* ❌ MODAL ERROR */}
      <Modal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        title="Erreur"
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
              Forgot your password?
              <FcLock className="ml-2 text-2xl sm:text-3xl" />
            </Title>
          </div>

          {/* Description */}
          <div className="text-gray-500 text-sm sm:text-base mb-6 sm:text-left">
            Enter your email, and we will send you instructions to reset your password.
          </div>

          {/* Email Field */}
          <div className="mb-6">
            <p className="text-gray-500 mb-2 text-sm sm:text-base">Email</p>
            <Input
              type="email"
              placeholder="Enter your email"
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
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </div>
              ) : (
                'Send Reset Link'
              )}
            </ButtonPrimary>
          </div>

          {/* Back to Login Link */}
          <div className="flex justify-center">
            <Link href="/login" 
              className="text-[#7367f0] text-sm sm:text-base hover:underline no-underline flex items-center transition-colors duration-200 hover:text-[#5e52e6]"
            >
              <IoIosArrowBack className="mr-2 text-xl sm:text-2xl" />
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}

export default ForgotPasswordPage;