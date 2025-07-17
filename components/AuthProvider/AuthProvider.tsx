"use client";

import { checkSession, fetchUser } from "@/lib/api/clientApi";
import { useAuth } from "@/lib/store/authStore";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const setUser = useAuth((state) => state.setUser);
  const clearIsAuthenticated = useAuth((state) => state.clearIsAuthenticated);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const isAuthenticated = await checkSession();

        if (isAuthenticated) {
          const user = await fetchUser();
          setUser(user);
        } else {
          clearIsAuthenticated();
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        clearIsAuthenticated();
        toast.error("Please log in or sign up to continue.");
      }
    };

    fetchSession();
  }, [setUser, clearIsAuthenticated]);

  return <>{children}</>; // ✅ потрібно обгортати в Fragment
};

export default AuthProvider;
