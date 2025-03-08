// Import UI components and icons
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LuAlignLeft } from "react-icons/lu";
import Link from "next/link";
import { Button } from "../ui/button";
import { links } from "@/utils/links";
import UserIcon from "./UserIcon";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import SignOutLink from "./SignOutLink";
import { auth } from "@clerk/nextjs/server";

// Dropdown menu component for navigation links and authentication
async function LinksDropdown() {
  const { userId } = await auth();
  const isAdmin = userId === process.env.ADMIN_USER_ID;

  return (
    <DropdownMenu>
      {/* Dropdown trigger button with hamburger and user icon */}
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex max-w-[100px] gap-4">
          <LuAlignLeft className="h-6 w-6" />
          <UserIcon />
        </Button>
      </DropdownMenuTrigger>

      {/* Dropdown content */}
      <DropdownMenuContent className="w-40" align="start" sideOffset={10}>
        {/* Show these items when user is not authenticated */}
        <SignedOut>
          <DropdownMenuItem>
            <SignInButton mode="modal">
              <button className="w-full text-left">Login</button>
            </SignInButton>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <SignUpButton mode="modal">
              <button className="w-full text-left">Register</button>
            </SignUpButton>
          </DropdownMenuItem>
        </SignedOut>

        {/* Show these items when user is authenticated */}
        <SignedIn>
          {/* Map through navigation links */}
          {links.map((link) => {
            if (link.label === "dashboard" && !isAdmin) return null; // Hide dashboard link for non-admin users
            return (
              <DropdownMenuItem key={link.href}>
                <Link href={link.href} className="w-full capitalize">
                  {link.label}
                </Link>
              </DropdownMenuItem>
            );
          })}

          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <SignOutLink />
          </DropdownMenuItem>
        </SignedIn>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LinksDropdown;
