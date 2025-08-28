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
  
  // Modals state
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Client-side validation
    if (!email) {
      setModalMessage('Please enter your email address.');
      setIsErrorModalOpen(true);
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setModalMessage('Please enter a valid email address.');
      setIsErrorModalOpen(true);
      setIsLoading(false);
      return;
    }

    try {
      // Settings for reset email
      const actionCodeSettings = {
        // Redirect URL after clicking the link
        url: `${window.location.origin}/login`,
        handleCodeInApp: false, // The link will open in browser, not in the app
      };

      // Send password reset email
      await sendPasswordResetEmail(auth, email, actionCodeSettings);

      setModalMessage(
        `A reset email has been sent to ${email}. ` +
        'Check your inbox and spam folder. ' +
        'The link will be valid for 1 hour.'
      );
      setIsSuccessModalOpen(true);
      setEmail(''); 

    } catch (error: any) {
      console.error('Error sending password reset email:', error);
      
      let message = 'Error sending password reset email.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          message = 'No account found with this email address.';
          break;
        case 'auth/invalid-email':
          message = 'Invalid email address.';
          break;
        case 'auth/too-many-requests':
          message = 'Too many attempts. Please try again later.';
          break;
        case 'auth/network-request-failed':
          message = 'Connection error. Check your internet connection.';
          break;
        case 'auth/quota-exceeded':
          message = 'Email quota exceeded. Please try again later.';
          break;
        default:
          message = `Error: ${error.message}`;
      }

      setModalMessage(message);
      setIsErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* ✅ SUCCESS MODAL */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          // Do not redirect automatically, let the user choose
        }}
        title="Email Sent ✅"
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
              Back to login
            </ButtonPrimary>
            <ButtonPrimary
              onClick={() => setIsSuccessModalOpen(false)}
              className="flex-1 py-2 text-sm bg-gray-600 hover:bg-gray-700"
            >
              Close
            </ButtonPrimary>
          </div>
        </div>
      </Modal>

      {/* ❌ ERROR MODAL */}
      <Modal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        title="Error ❌"
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
              Forgot Password?
              <FcLock className="ml-2 text-2xl sm:text-3xl" />
            </Title>
          </div>

          {/* Description */}
          <div className="text-gray-500 text-sm sm:text-base mb-6 sm:text-left">
            Enter your email address and we will send you a link to reset your password.
          </div>

          {/* Email Field */}
          <div className="mb-6">
            <p className="text-gray-500 mb-2 text-sm sm:text-base">Email</p>
            <Input
              type="email"
              placeholder="Enter your email address"
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
              Back to login
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-6 p-3 bg-blue-900/20 rounded-lg border border-blue-700/30">
            <p className="text-blue-300 text-xs sm:text-sm text-center">
              💡 Tip: Also check your spam folder if you do not receive the email within 5 minutes.
            </p>
          </div>
        </form>
      </div>
    </>
  );
}

export default ForgotPasswordPage;
