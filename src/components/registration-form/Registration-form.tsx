"use client";

import { registrationValidatorWithConfirmPassword } from "@/lib/validators/registration/registration-validator";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

export function RegistrationForm() {
  const router = useRouter();
  const [formErrors, setFormErrors] = useState<Record<string, string | null>>({
    firstName: null,
    lastName: null,
    email: null,
    password1: null,
    password2: null,
    dob: null,
    gender: null,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    clearFormErrors();
    try {
      registrationValidatorWithConfirmPassword.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          setFormErrors((prev) => ({
            ...prev,
            [err.path[0]]: err.message,
          }));
        });
      }
      console.error("Error parsing form data:", error);
      return;
    }
    // Perform your registration logic here
    // For example, send the data to your API endpoint
    const response = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const { email, password1 } = data;
      await signInFromRegistration(email as string, password1 as string);
    } else {
      console.error("Registration failed");
    }
  };

  async function signInFromRegistration(email: string, password: string) {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      console.error("Error signing in:", res.error);
      return;
    }
    router.push("/dashboard");
  }
  const clearFormErrors = () => {
    setFormErrors({
      firstName: null,
      lastName: null,
      email: null,
      password1: null,
      password2: null,
      dob: null,
      gender: null,
    });
  };
  return (
    <div className="p-4">
      <div className="flex justify-center mb-4">
        <Link href="/dashboard" className="self-center">
          <Image
            src="/images/app-logo/large-app-logo.png"
            className="rounded-full"
            alt="app-logo"
            width={200}
            height={200}
          />
        </Link>
      </div>
      <h1 className="text-2xl text-center mb-4 font-bold">Create Account</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">E-mail address:</label>
          <div>
            <input
              type="email"
              id="email"
              name="email"
              className="border border-gray-300 rounded p-2 mb-4 w-full"
              required
              maxLength={100}
            />
            {formErrors.email && (
              <p className="text-red-500 text-sm">{formErrors.email}</p>
            )}
          </div>
          <label htmlFor="firstName">First Name:</label>
          <div>
            <input
              type="text"
              id="firstName"
              maxLength={50}
              name="firstName"
              className="border border-gray-300 rounded p-2 mb-4 w-full"
              required
            />
            {formErrors.firstName && (
              <p className="text-red-500 text-sm">{formErrors.firstName}</p>
            )}
          </div>
          <label htmlFor="firstName">Last Name:</label>
          <div>
            <input
              type="text"
              maxLength={50}
              id="lastName"
              name="lastName"
              className="border border-gray-300 rounded p-2 mb-4 w-full"
              required
            />
            {formErrors.lastName && (
              <p className="text-red-500 text-sm">{formErrors.lastName}</p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="dob">Date of Birth:</label>
          <div>
            {/* Gender select */}
            <select
              id="gender"
              name="gender"
              className="border border-gray-300 rounded p-2 mb-4 w-full"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {formErrors.gender && (
              <p className="text-red-500 text-sm">{formErrors.gender}</p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="dob">Date of Birth:</label>
          <div>
            <input
              type="date"
              id="dob"
              name="dob"
              className="w-full p-2"
              autoComplete="off"
              data-lpignore="true"
              onKeyDown={() => false}
              required
            ></input>
            {formErrors.dob && (
              <p className="text-red-500 text-sm">{formErrors.dob}</p>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <div>
            <input
              type="password"
              id="password1"
              name="password1"
              className="border border-gray-300 rounded p-2 mb-4 w-full"
              required
              maxLength={50}
            />
            {formErrors.password1 && (
              <p className="text-red-500 text-sm">{formErrors.password1}</p>
            )}
          </div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <div>
            <input
              type="password"
              id="password2"
              name="password2"
              className="border border-gray-300 rounded p-2 mb-4 w-full"
              maxLength={50}
              required
            />
            {formErrors.password2 && (
              <p className="text-red-500 text-sm">{formErrors.password2}</p>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Submit
          </button>
          <Link href={"/login"}>Log in with existing account</Link>
        </div>
      </form>
    </div>
  );
}
