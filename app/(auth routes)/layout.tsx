"use client";

import Loader from "@/components/Loader/Loader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    router.refresh();
    setIsLoading(false);
  }, [router]);

  return isLoading ? (
    <Loader
      size={80}
      thickness={8}
      color="#0050ff"
      borderColor="rgba(0, 80, 255, 0.3)"
      shadowColor="rgba(0, 80, 255, 0.5)"
      innerSize={70}
      innerThickness={4}
      innerColor="#00fff0"
      innerBorderColor="rgba(0, 255, 240, 0.2)"
    />
  ) : (
    children
  );
};

export default AuthLayout;
