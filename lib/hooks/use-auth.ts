"use client";

import { useEffect, useState } from "react";

interface User {
  username: string;
  isAdmin: boolean;
}

export const useAuth = (): {
  user: User | undefined;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
} => {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    // Grab user from local storage
    const user = localStorage.getItem("user");

    if (user) {
      setUser(JSON.parse(user));
    } else {
      setUser(undefined);
    }
  }, []);

  const login = async (username: string, password: string) => {
    return fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((json) => {
        if ("message" in json) {
          throw new Error(json.message);
        }

        setUser(json);
        localStorage.setItem("user", JSON.stringify(json));
      });
  };

  const logout = () => {
    setUser(undefined);
    localStorage.removeItem("user");
  };

  return { user, login, logout };
};
