"use client";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { ButtonPrimary } from "@/components/button/Button";
import Modal from "@/components/modals/Modal";
import Input from "@/components/input/Input";
import { useRouter } from "next/navigation";

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

    // Validation simple des champs
    if (!email || !password) {
      setModalMessage("Please enter both email and password");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        // Enregistrer le token JWT dans le localStorage
        localStorage.setItem("tokenadmin", data.token);
        // Rediriger l'utilisateur vers le dashboard
        router.push("/dashboard");
      } else if (response.status === 401) {
        setModalMessage("Unauthorized: Invalid email or password"); // Message spécifique pour 401
      } else {
        setModalMessage(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setModalMessage("An error occurred while logging in");
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
        <p>{modalMessage}</p>
      </Modal>

      {/* ❌ MODAL ERROR */}
      <Modal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        title="Erreur"
      >
        <p>{modalMessage}</p>
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

            {/* Remember Me Checkbox */}
            {/* <div className='mb-6'>
            <Checkbox
              label="Remember me"
              checked
              onChange={() => {}}
            />
          </div> */}

            {/* Login Button */}
            <div className="mb-6">
              <ButtonPrimary className="w-full">Sign In</ButtonPrimary>
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
