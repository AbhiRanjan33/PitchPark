"use client";

import { signIn } from "next-auth/react";
import { setRoleInStorage } from "../role"; // Adjust path as needed

export default function SignInRole() {
  const handleRoleSelection = async (role: string) => {
    console.log("Selected Role:", role);
    setRoleInStorage(role); // Save the role in sessionStorage
    
    // Trigger GitHub sign-in
    await signIn("github", {
      redirect: true,
      callbackUrl: "/", // Redirect to homepage without query parameter
    });
  };

  return (
    <section className="pink_container">
      <h1 className="heading">Sign In to Your Account</h1>
      <p className="sub-heading">Choose your role to continue</p>
      <div className="flex-between gap-4 mt-8">
        <button
          onClick={() => handleRoleSelection("investor")}
          className="login px-6 py-4 text-[18px] font-semibold"
        >
          Investor
        </button>
        <button
          onClick={() => handleRoleSelection("startup-founder")}
          className="login px-6 py-4 text-[18px] font-semibold"
        >
          Startup Founder
        </button>
      </div>
    </section>
  );
}