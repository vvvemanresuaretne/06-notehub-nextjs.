"use client";

import css from "./SignUpPage.module.css";
import { NewUser } from "@/types/user";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api/api";
import { useAuth } from "@/lib/store/authStore";
import toast from "react-hot-toast";
import { useState } from "react";

const SingUp = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const seUser = useAuth((state) => state.setUser);

  const handleSubmit = async (formData: FormData) => {
    try {
      const formValues = Object.fromEntries(formData) as NewUser;
      const res = await register(formValues);

      if (res) {
        toast.success("Registration was successful!");
        seUser(res);
        router.push("/profile");
      }
    } catch {
      setErrorMessage(
        "Registration failed. The account may already exist or an error occurred."
      );
    }
  };
  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form className={css.form} action={handleSubmit}>
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
            Register
          </button>
        </div>

        <p className={css.error}>{errorMessage}</p>
      </form>
    </main>
  );
};

export default SingUp;