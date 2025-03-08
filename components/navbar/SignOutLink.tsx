"use client";

import { useToast } from "@/hooks/use-toast";
import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

function SignOutLink() {
  const { toast } = useToast();

  const handleSignOut = async () => {
    toast({ description: "Logout successful" });
  };
  return (
    <SignOutButton>
      <Link href="/" className="w-full text-left" onClick={handleSignOut}>
        Logout
      </Link>
    </SignOutButton>
  );
}

export default SignOutLink;
