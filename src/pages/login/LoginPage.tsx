"use client";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { ButtonPrimary } from "@/components/button/Button";
import Modal from "@/components/modals/Modal";
import Input from "@/components/input/Input";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setModalMessage("Please enter both email and password");
      setIsErrorModalOpen(true);
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Récupérer l’utilisateur Firebase
      const user = userCredential.user;

      // Stocker le token Firebase ID si besoin
      const token = await user.getIdToken();
      localStorage.setItem("tokenadmin", token);

      setIsLoading(false);
      setModalMessage("Login successful 🎉");
      setIsSuccessModalOpen(true);

      // Redirection
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      setModalMessage(error.message || "An error occurred while logging in");
      setIsErrorModalOpen(true);
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* ✅ MODAL SUCCESS */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Succès"
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

      <div className="flex justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 w-full items-center px-4 py-8">
        <div className="group bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl p-4 sm:p-8 rounded-lg shadow-2xl w-full max-w-md mx-auto">
          {/* Logo */}
          <div
            onClick={() => router.push("/")}
            className="flex cursor-pointer text-5xl sm:text-6xl md:text-7xl lg:text-8xl  justify-center mb-6 "
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
              SaveLink
            </span>
          </div>
          <form onSubmit={handleLogin}>
            {/* Email Input */}
            <div className="mb-4">
              <p className="text-gray-500 mb-1">Email</p>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <div className="flex flex-wrap justify-between mb-1">
                <p className="text-gray-500">Password</p>
                <Link
                  href="/forgot-password"
                  className="text-[#7367f0] text-sm hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                icon={
                  showPassword ? (
                    <FaEye
                      onClick={togglePasswordVisibility}
                      className="cursor-pointer text-gray-500 text-xl"
                    />
                  ) : (
                    <FaEyeSlash
                      onClick={togglePasswordVisibility}
                      className="cursor-pointer text-gray-500 text-xl"
                    />
                  )
                }
              />
            </div>

            {/* Login Button */}
            <div className="mb-6">
              <ButtonPrimary className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 
                        3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Loading
                  </div>
                ) : (
                  "Sign In"
                )}
              </ButtonPrimary>
            </div>
          </form>

          {/* Register Link */}
          <div>
            <p className="text-center text-gray-500 text-sm">
              New to our platform?{" "}
              <Link href="/register" className="text-[#7367f0] hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
