"use client";
import React, { useState } from "react";
import css from "./SignInPage.module.css";
import { NewUser } from "@/types/user";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/api";
import { useAuth } from "@/lib/store/authStore";
import toast from "react-hot-toast";

const SignIn = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const setUser = useAuth((state) => state.setUser);

  const handleSubmit = async (formData: FormData) => {
    try {
      const formValues = Object.fromEntries(formData) as NewUser;
      const res = await login(formValues);
      if (res) {
        toast.success("Login successful!");
        setUser(res);
        router.push("/profile");
      }
    } catch {
      setErrorMessage("Incorrect username or password.");
    }
  };
  return (
    <main className={css.mainContent}>
      <form className={css.form} action={handleSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Log in
          </button>
        </div>

        <p className={css.error}>{errorMessage}</p>
      </form>
    </main>
  );
};

export default SignIn;