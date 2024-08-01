import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";

const NavBar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-8">
          <Link href="/">Home</Link>
          {!user && <Link href="/log-in">Log-in</Link>}
          {user && (
            <Link
              href="/"
              onClick={() => {
                logout();
              }}
            >
              Log-out
            </Link>
          )}
        </div>
        {user && <div>Hello, {user.username}</div>}
      </div>
    </nav>
  );
};

export default NavBar;
