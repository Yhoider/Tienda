"use client";

import { useEffect, useState } from "react";
import type { LoginRequest, RegisterRequest, User } from "../domain/types";
import * as authService from "../services/authService";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { setUser(authService.getSavedUser()); }, []);

  async function login(credentials: LoginRequest) {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      return response.user;
    } finally { setIsLoading(false); }
  }

  async function register(credentials: RegisterRequest) {
    setIsLoading(true);
    try {
      const response = await authService.register(credentials);
      setUser(response.user);
      return response.user;
    } finally { setIsLoading(false); }
  }

  function logout() { authService.logout(); setUser(null); }
  return { user, isLoading, login, register, logout };
}
