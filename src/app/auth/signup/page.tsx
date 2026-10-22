"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignupRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/auth?mode=signup");
  }, [router]);

  return (
    <main className="min-h-screen bg-[#fcf9f2] p-8 font-mono text-xs">
      INITIALIZING SECURE REGISTRATION GATEWAY...
    </main>
  );
}
