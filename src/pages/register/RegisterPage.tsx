"use client";

import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import Logo from "../../../public/logo.png";
import Input from "@/components/input/Input";
import Image from "next/image";
import Modal from "@/components/modals/Modal";
import Checkbox, { ButtonPrimary } from "@/components/button/Button";
import { API } from "@/const/Constant";
import { useRouter } from "next/navigation";

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Fonction de validation du mot de passe
  const validatePassword = (pwd: string) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return regex.test(pwd);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(
      validatePassword(newPassword)
        ? ""
        : "Le mot de passe doit contenir au moins 6 caractères, une majuscule, un chiffre et un symbole."
    );
    setConfirmPasswordError(
      confirmPassword && newPassword !== confirmPassword
        ? "Les mots de passe ne correspondent pas."
        : ""
    );
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setConfirmPasswordError(
      newConfirmPassword !== password
        ? "Les mots de passe ne correspondent pas."
        : ""
    );
  };

  const router = useRouter();

  // Add the data to the database
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setModalMessage("Vous devez accepter les conditions d'utilisation !");
      setIsErrorModalOpen(true);
      return;
    }

    if (!validatePassword(password)) {
      setModalMessage("Le mot de passe n'est pas valide !");
      setIsErrorModalOpen(true);
      return;
    }
    if (password !== confirmPassword) {
      setModalMessage("Les mots de passe ne correspondent pas !");
      setIsErrorModalOpen(true);
      return;
    }

    const response = await fetch(`${API}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userName,
        email: email,
        password: password,
      }),
    });

    const responseText = await response.text();
    console.log("Réponse brute:", responseText);

    try {
      const data = JSON.parse(responseText);
      if (response.ok) {
        setModalMessage("Compte créé avec succès !");
        setIsSuccessModalOpen(true);
        router.push("/create-database");
      } else {
        setModalMessage(data.message || "Une erreur est survenue !");
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      setModalMessage("Erreur lors de la connexion au serveur !");
      setIsErrorModalOpen(true);
      console.error("Erreur de parsing JSON:", error);
    }
  };

  // États pour gérer les modals
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    if (!isSuccessModalOpen) {
      setPassword("");
      setConfirmPassword("");
      setEmail("");
      setUserName("");
      setTermsAccepted(false);
    }
  }, [isSuccessModalOpen]);
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
      {/* Toast Container (Obligatoire pour react-hot-toast) */}
      <div className="flex justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen w-full items-center">
        <form
          key={isSuccessModalOpen ? "reset-form" : "form"}
          onSubmit={handleSubmit}
          className="group bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl p-4 sm:p-6 rounded-lg shadow-2xl w-full max-w-md mx-auto"
        >
          {/* Logo */}
           <div
            onClick={() => router.push("/")}
            className="flex cursor-pointer text-5xl sm:text-6xl md:text-7xl lg:text-8xl  justify-center mb-6 "
          >
               <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                SaveLink
              </span>
          </div>

          {/* Username Input */}
          <div className="mb-2">
            <p className="text-gray-500 mb-1">Name or Username</p>
            <Input
              type="text"
              placeholder="Enter your name or username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>

          {/* Email Input */}
          <div className="mb-2">
            <p className="text-gray-500 mb-1">Email</p>
            <Input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="mb-2">
            <p className="text-gray-500 mb-1">Password</p>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              required
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
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="mb-2">
            <p className="text-gray-500 mb-1">Confirm Password</p>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
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
            {confirmPasswordError && (
              <p className="text-red-500 text-sm mt-1">
                {confirmPasswordError}
              </p>
            )}
          </div>

          {/* Terms & Conditions Checkbox */}
          <div className="mb-4 flex items-center">
            <Checkbox
              
              label="I accept the Terms of Service and Privacy Policy"
              checked={termsAccepted}
              onChange={() => setTermsAccepted(!termsAccepted)}
            />
          </div>

          {/* Register Button */}
          <div className="mb-4">
            <ButtonPrimary className="w-full" type="submit">
              Create an Account
            </ButtonPrimary>
          </div>

          {/* Login Link */}
          <div>
            <p className="text-center text-gray-500 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-[#7367f0] hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}

export default RegisterPage;
