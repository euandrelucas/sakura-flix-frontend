"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function LogoutPage() {
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      await logout();
      router.push("/auth/login");
    };

    performLogout();
  }, [logout, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
        <h1 className="mt-6 text-2xl font-bold">Logging you out...</h1>
        <p className="mt-2 text-muted-foreground">
          Please wait while we securely log you out.
        </p>
      </div>
    </div>
  );
}
