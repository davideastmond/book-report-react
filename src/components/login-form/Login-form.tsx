"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  // State to manage form errors
  const [formErrors, setFormErrors] = useState({
    email: null,
    password1: null,
  });

  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    clearFormErrors();
    setApiError(null);

    const res = await signIn("credentials", {
      callbackUrl: "/dashboard",
      email: data.email,
      password: data.password1,
      redirect: false,
    });
    if (res?.error) {
      setApiError(
        "We're not able to log you in. Please check your credentials."
      );
      return;
    }
    router.push("/dashboard");
  };

  const clearFormErrors = () => {
    setFormErrors({
      email: null,
      password1: null,
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
      <h1 className="text-2xl text-center mb-4 font-bold">Log In</h1>
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
            />
            {formErrors.email && (
              <p className="text-red-500 text-sm">{formErrors.email}</p>
            )}
          </div>
        </div>
        <label htmlFor="password">Password:</label>
        <div>
          <input
            type="password"
            id="password1"
            name="password1"
            className="border border-gray-300 rounded p-2 mb-4 w-full"
            required
          />
          {formErrors.password1 && (
            <p className="text-red-500 text-sm">{formErrors.password1}</p>
          )}
        </div>
        <div className="flex justify-between">
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Submit
          </button>
          <Link href={"/register"}>New Account</Link>
        </div>
        {apiError && <p className="text-red-500 text-sm mt-6">{apiError}</p>}
      </form>
    </div>
  );
}
