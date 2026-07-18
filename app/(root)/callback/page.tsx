"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Callback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  useEffect(() => {
    const role = searchParams.get("role");
    if (role && status === "authenticated") {
      // Call an API to save the role to Sanity
      fetch("/api/save-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            router.push("/"); // Redirect to homepage
          } else {
            console.error("Failed to save role:", data.error);
          }
        })
        .catch((err) => console.error("Error saving role:", err));
    }
  }, [status, router, searchParams]);

  return <div>Processing sign-in...</div>;
}