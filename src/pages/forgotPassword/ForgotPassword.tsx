'use client';
import Image from 'next/image';
import { FcLock } from 'react-icons/fc';
import Input from '@/components/input/Input';
import { IoIosArrowBack } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import { ButtonPrimary } from '@/components/button/Button';
import Link from 'next/link';
import Title from '@/components/title/Title';

function ForgotPasswordPage() {
  const router = useRouter();
  return (
    <>
      <div className="flex justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900  min-h-screen w-full items-center px-4 py-6 sm:py-8">
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
            />
          </div>

          {/* Button */}
          <div className="mb-8">
            <ButtonPrimary className="w-full py-2.5 text-sm sm:text-base">
              Send Reset Link
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
        </div>
      </div>
    </>
  );
}

export default ForgotPasswordPage;