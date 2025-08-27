"use client";

import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import Input from "@/components/input/Input";
import Modal from "@/components/modals/Modal";
import Checkbox, { ButtonPrimary } from "@/components/button/Button";
import { useRouter } from "next/navigation";

// firebase importation
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);


    // États pour gérer les modals
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");



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
  setIsLoading(true);

  if (!termsAccepted) {
    setModalMessage("Vous devez accepter les conditions d'utilisation !");
    setIsErrorModalOpen(true);
    setIsLoading(false); 
    return;
  }

  if (!validatePassword(password)) {
    setModalMessage("Le mot de passe n'est pas valide !");
    setIsErrorModalOpen(true);
    setIsLoading(false);
    return;
  }
  if (password !== confirmPassword) {
    setModalMessage("Les mots de passe ne correspondent pas !");
    setIsErrorModalOpen(true);
    setIsLoading(false);
    return;
  }

  try {
    // ✅ Création utilisateur avec Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    setModalMessage("Compte créé avec succès !");
    setIsSuccessModalOpen(true);
    setIsLoading(false);   
    // ✅ Ajouter username dans le profil Firebase
    await updateProfile(user, { displayName: userName });

    // ✅ Enregistrer dans Firestore
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      username: userName,
      email,
      createdAt: new Date().toISOString(),
    });

    

 } catch (error: any) {
  console.error("Firebase error:", error);
  let message = "Erreur lors de la création du compte.";
  
  if (error.code === "auth/email-already-in-use") {
    message = "Cet email est déjà utilisé.";
  } else if (error.code === "auth/weak-password") {
    message = "Mot de passe trop faible.";
  } else if (error.code === "permission-denied") {
    message = "Erreur de permission. Contactez l'administrateur.";
  } else {
    // Log plus détaillé pour les autres erreurs
    console.error("Erreur Firestore détaillée:", error);
    message = `Erreur technique: ${error.message || "Veuillez réessayer"}`;
  }

  setModalMessage(message);
  setIsErrorModalOpen(true);
  setIsLoading(false);
}
}


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
        onClose={() => {
          setIsSuccessModalOpen(false);
          router.push("/login"); 
        }}
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
          {/* <div className="mb-2">
            <p className="text-gray-500 mb-1">Name or Username</p>
            <Input
              type="text"
              placeholder="Enter your name or username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
 */}
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
                 {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading
                </div>
                 ) : "Create an Account"}
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
