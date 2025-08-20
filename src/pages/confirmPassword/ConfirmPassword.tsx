import { ButtonPrimary } from '@/components/button/Button';
import Title from '@/components/title/Title';
import Input from "@/components/input/Input";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcLock } from 'react-icons/fc';

function ConfirmPasswordPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="flex justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen w-full items-center px-4 py-6 sm:py-8">
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
          {/* Title */}
          <div className="flex justify-center sm:justify-start mb-2">
            <Title 
              type="h3" 
              variant="secondary" 
              className="flex items-center text-center sm:text-left"
            >
              Confirm your password
              <FcLock className="ml-2 text-2xl sm:text-3xl" />
            </Title>
          </div>

          {/* Description */}
          <div className="text-gray-500 text-sm sm:text-base mb-6 sm:text-left">
            Enter your new password.
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <p className="text-gray-500 mb-2 text-sm sm:text-base">New Password</p>
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
          <div className="mb-6">
            <p className="text-gray-500 mb-2 text-sm sm:text-base">Confirm Password</p>
            <Input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
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

          {/* Button */}
          <div className="mb-8">
            <ButtonPrimary className="w-full py-2.5 text-sm sm:text-base">
              Confirm password
            </ButtonPrimary>
          </div>

        </div>
      </div>
    </>
  );
}
export default ConfirmPasswordPage