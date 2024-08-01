"use client";
import React, { useEffect, useState } from "react";
import "../../styles/login.css";
import NavBar from "../../components/nav";
import { useAuth } from "../../lib/hooks/use-auth";
import { useRouter } from "next/navigation";

const LogIn = () => {
  const { user, login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const canSubmit = username.length > 0 && password.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    login(username, password)
      .catch((error) => setError(error.message))
      .finally(() => setIsSubmitting(false));
  };

  useEffect(() => {
    if (user && router) {
      router.push("/");
    }
  }, [router, user]);

  return (
    <div className="font-sans bg-gray-100 text-center p-12 min-h-screen">
      <NavBar />
      <div className="flex mt-8 justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg w-4/5 max-w-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          {error && (
            <div className="bg-red-500 text-white p-3 rounded mb-4 text-left">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-left text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-left text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={!canSubmit || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
