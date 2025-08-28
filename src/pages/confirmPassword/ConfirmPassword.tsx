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
  
  // Get oobCode from URL
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

  // Verify code on mount
  useEffect(() => {
    const verifyCode = async () => {
      if (!oobCode) {
        setError("Invalid or missing reset link.");
        setCodeValid(false);
        return;
      }

      try {
        // Verify code and get user email
        const userEmail = await verifyPasswordResetCode(auth, oobCode);
        setEmail(userEmail);
        setCodeValid(true);
      } catch (err: any) {
        console.error("Code verification error:", err);
        let errorMessage = "Invalid or expired reset link.";
        
        switch (err.code) {
          case 'auth/expired-action-code':
            errorMessage = "This reset link has expired. Please request a new one.";
            break;
          case 'auth/invalid-action-code':
            errorMessage = "This reset link is invalid.";
            break;
          case 'auth/user-disabled':
            errorMessage = "This user account has been disabled.";
            break;
          case 'auth/user-not-found':
            errorMessage = "No user found for this reset request.";
            break;
          default:
            errorMessage = `Error: ${err.message}`;
        }
        
        setError(errorMessage);
        setCodeValid(false);
      }
    };

    verifyCode();
  }, [oobCode]);

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters.";
    }
    return null;
  };

  const handleResetPassword = async () => {
    setError("");
    setSuccess("");

    if (!oobCode) {
      setError("Invalid or expired reset link.");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await confirmPasswordReset(auth, oobCode, password);
      setSuccess("Password successfully reset! Redirecting to login...");
      
      setTimeout(() => {
        router.push("/login");
      }, 3000);
      
    } catch (err: any) {
      console.error("Reset error:", err);
      
      let errorMessage = "Error resetting password.";
      
      switch (err.code) {
        case 'auth/expired-action-code':
          errorMessage = "This reset link has expired. Please request a new one.";
          break;
        case 'auth/invalid-action-code':
          errorMessage = "This reset link is invalid.";
          break;
        case 'auth/user-disabled':
          errorMessage = "This user account has been disabled.";
          break;
        case 'auth/user-not-found':
          errorMessage = "No user found.";
          break;
        case 'auth/weak-password':
          errorMessage = "Password is too weak.";
          break;
        default:
          errorMessage = `Error: ${err.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Loading while verifying code
  if (codeValid === null) {
    return (
      <div className="flex justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen w-full items-center px-4 py-6 sm:py-8">
        <div className="group bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl p-4 sm:p-8 rounded-lg shadow-2xl w-full max-w-md mx-auto">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
            <span className="ml-4 text-white">Verifying link...</span>
          </div>
        </div>
      </div>
    );
  }

  // Invalid code
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
              Invalid Link
            </Title>
            <p className="text-red-500 text-sm mb-6">{error}</p>
            
            <ButtonPrimary
              className="w-full py-2.5 text-sm mb-4"
              onClick={() => router.push("/forgot-password")}
            >
              Request a new link
            </ButtonPrimary>
            
            <ButtonPrimary
              className="w-full py-2.5 text-sm bg-gray-600 hover:bg-gray-700"
              onClick={() => router.push("/login")}
            >
              Back to login
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
            Reset Password
            <FcLock className="ml-2 text-2xl" />
          </Title>
        </div>

        {/* Email Info */}
        {email && (
          <div className="mb-6 p-3 bg-blue-900/30 rounded-lg border border-blue-700/50">
            <p className="text-blue-300 text-sm">
              <span className="font-medium">Email:</span> {email}
            </p>
          </div>
        )}

        {/* New Password */}
        <div className="mb-6">
          <p className="text-gray-500 mb-2 text-sm">New Password</p>
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 6 characters"
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
          <p className="text-gray-500 mb-2 text-sm">Confirm Password</p>
          <Input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
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
                Resetting...
              </div>
            ) : (
              'Confirm New Password'
            )}
          </ButtonPrimary>
        </div>

        {/* Back to Login */}
        <div className="text-center">
          <button
            onClick={() => router.push("/login")}
            className="text-[#7367f0] text-sm hover:underline transition-colors duration-200 hover:text-[#5e52e6]"
          >
            Back to login
          </button>
        </div>

      </div>
    </div>
  );
}

export default ConfirmPasswordPage;
