"use client";

import { UserClient } from "@/clients/user-client";
import { User } from "@/db/schema";
import { useToast } from "app/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export function UserSettingsForm() {
  const { data: session, status } = useSession();
  const [userContext, setUserContext] = useState<Partial<User> | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [nameFormErrors, setNameFormErrors] = useState<{
    firstName?: string;
    lastName?: string;
  }>({
    firstName: "",
    lastName: "",
  });

  const [genderFormErrors, setGenderFormErrors] = useState<{
    gender?: string;
  }>({
    gender: "",
  });

  const [passwordFormErrors, setPasswordFormErrors] = useState<{
    password1?: string;
    password2?: string;
  }>({
    password1: "",
    password2: "",
  });

  const {
    showToast: showNameChangedToast,
    ToastElement: NameChangedToastElement,
  } = useToast();
  const {
    showToast: showPasswordChangedToast,
    ToastElement: PasswordChangedToastElement,
  } = useToast();

  const {
    showToast: showGenderChangedToast,
    ToastElement: GenderChangedToastElement,
  } = useToast();

  const router = useRouter();

  useEffect(() => {
    getUserIdentity();
  }, [session?.user?.id]);

  async function getUserIdentity() {
    if (session?.user?.id) {
      try {
        const response = await UserClient.getUserIdentity(session.user.id);
        setUserContext(response);
        loadPrepopulatedNameData(
          response.firstName as string,
          response.lastName as string
        );
        loadPrepopulatedGenderData(response.gender as string);
      } catch (error) {
        console.error("Failed to fetch user identity:", error);
      }
    }
  }

  function loadPrepopulatedNameData(firstName: string, lastName: string) {
    const firstNameInput = document.getElementById(
      "firstName"
    ) as HTMLInputElement;
    const lastNameInput = document.getElementById(
      "lastName"
    ) as HTMLInputElement;

    firstNameInput.value = firstName;
    lastNameInput.value = lastName;
  }

  function loadPrepopulatedGenderData(gender: string) {
    const genderInput = document.getElementById("gender") as HTMLSelectElement;

    genderInput.value = gender;
  }

  async function handlePasswordUpdateFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsBusy(true);
    // Reset any previous errors
    setPasswordFormErrors({ password1: "", password2: "" });
    const formData = new FormData(e.currentTarget);
    const password1 = formData.get("password1") as string;
    const password2 = formData.get("password2") as string;

    // Validate the input
    if (!password1 || !password2) {
      setIsBusy(false);
      setPasswordFormErrors({
        password1: !password1 ? "Password is required" : "",
        password2: !password2 ? "Confirm Password is required" : "",
      });
      return;
    }
    if (password1 !== password2) {
      setIsBusy(false);
      setPasswordFormErrors({
        password1: "Passwords do not match",
        password2: "Passwords do not match",
      });
      return;
    }

    try {
      await UserClient.updatePassword(session?.user?.id as string, password1);
      // Optionally, you can show a success message or update the UI
      showPasswordChangedToast("Password updated successfully.");
    } catch (error) {
      console.error("Failed to update user password:", error);
    } finally {
      setIsBusy(false);
    }
  }

  async function handleNameChangeFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsBusy(true);
    setNameFormErrors({ firstName: "", lastName: "" });

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;

    // Validate the input
    if (!firstName || !lastName) {
      setIsBusy(false);
      setNameFormErrors({
        firstName: !firstName ? "First name is required" : "",
        lastName: !lastName ? "Last name is required" : "",
      });
      return;
    }

    try {
      await UserClient.updateUserName(session?.user?.id as string, {
        firstName,
        lastName,
      });
      // Optionally, you can show a success message or update the UI
      showNameChangedToast("Name updated successfully.");
    } catch (error) {
      console.error("Failed to update user identity:", error);
    } finally {
      setIsBusy(false);
    }
  }

  async function handleGenderChangeFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsBusy(true);

    const formData = new FormData(e.currentTarget);
    const gender = formData.get("gender") as string;

    // Validate the input
    if (!gender) {
      setIsBusy(false);
      setGenderFormErrors({ gender: "Gender is required" });
      return;
    }

    try {
      await UserClient.updateUserGender(session?.user?.id as string, gender);
      // Optionally, you can show a success message or update the UI
      showGenderChangedToast("Gender updated successfully.");
    } catch (error) {
      console.error("Failed to update user gender:", error);
    } finally {
      setIsBusy(false);
    }
  }

  if (status === "unauthenticated") {
    router.replace("/login");
    return null; // Prevent rendering while redirecting
  }
  return (
    <div>
      <section className="p-4 mt-10">
        {/* First section is for read-only stuff: email and DOB */}
        <h2 className="text-2xl">Overview</h2>
        <article>
          <span className="flex gap-2">
            <p>E-mail:</p>
            <p className="font-thin">{session?.user?.email}</p>
          </span>
          <span className="flex gap-2">
            <p>Birth Date:</p>
            <p className="font-thin">
              {new Date(userContext?.dob as Date).toLocaleDateString(
                "en-US",
                {}
              )}
            </p>
          </span>
        </article>
      </section>
      <section className="p-4 mt-10">
        <h2 className="text-2xl">Your name</h2>
        <form
          onSubmit={handleNameChangeFormSubmit}
          data-testid="update-user-form"
        >
          <label htmlFor="firstName">* First Name:</label>
          <div>
            <input
              maxLength={200}
              type="text"
              name="firstName"
              id="firstName"
              className="border border-gray-300 rounded p-2 mb-4 w-full"
              required
              disabled={isBusy}
            />
            {nameFormErrors.firstName && (
              <p className="text-red-500 text-sm">{nameFormErrors.firstName}</p>
            )}
          </div>
          <label htmlFor="lastName">* Last Name:</label>
          <div>
            <input
              maxLength={200}
              type="text"
              name="lastName"
              id="lastName"
              className="border border-gray-300 rounded p-2 mb-4 w-full"
              required
              disabled={isBusy}
            />
            {nameFormErrors.lastName && (
              <p className="text-red-500 text-sm">{nameFormErrors.lastName}</p>
            )}
          </div>
          <div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
              disabled={isBusy}
            >
              Update Name
            </button>
          </div>
        </form>
        <div>
          <NameChangedToastElement />
        </div>
      </section>
      <section className="p-4 mt-10">
        <h2 className="text-2xl">Gender</h2>
        <form onSubmit={handleGenderChangeFormSubmit} data-testid="gender-form">
          <label htmlFor="gender">* Gender:</label>
          <div>
            <select
              name="gender"
              id="gender"
              className="border p-2 mb-4 w-full"
              required
              disabled={isBusy}
            >
              <option className="bg-amber-background" value="male">
                Male
              </option>
              <option className="bg-amber-background" value="female">
                Female
              </option>
              <option className="bg-amber-background" value="other">
                Other
              </option>
              <option className="bg-amber-background" value="not_selected">
                Not selected
              </option>
            </select>
            {genderFormErrors.gender && (
              <p className="text-red-500 text-sm">{genderFormErrors.gender}</p>
            )}
          </div>
          <div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
              disabled={isBusy}
            >
              Update Gender
            </button>
          </div>
        </form>
        <div>
          <GenderChangedToastElement />
        </div>
      </section>
      <section className="p-4 mt-10">
        <h2 className="text-2xl">Your Password</h2>
        <article>
          <form
            onSubmit={handlePasswordUpdateFormSubmit}
            data-testid="update-password-form"
          >
            <label htmlFor="password1">* Password:</label>
            <div>
              <input
                maxLength={200}
                type="password"
                name="password1"
                id="password1"
                className="border border-gray-300 rounded p-2 mb-4 w-full"
                required
                disabled={isBusy}
              />
              {passwordFormErrors.password1 && (
                <p className="text-red-500 text-sm">
                  {passwordFormErrors.password1}
                </p>
              )}
            </div>
            <label htmlFor="password2">* Confirm Password:</label>
            <div>
              <input
                maxLength={200}
                type="password"
                name="password2"
                id="password2"
                className="border border-gray-300 rounded p-2 mb-4 w-full"
                required
                disabled={isBusy}
              />
              {passwordFormErrors.password2 && (
                <p className="text-red-500 text-sm">
                  {passwordFormErrors.password2}
                </p>
              )}
            </div>
            <div>
              <button
                type="submit"
                name="updatePassword"
                disabled={isBusy}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Update Password
              </button>
            </div>
          </form>
          <div>
            <PasswordChangedToastElement />
          </div>
        </article>
      </section>
    </div>
  );
}
