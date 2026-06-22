"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface AuthState {
  isAuthed: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthState>({
  isAuthed: false,
  isLoading: true,
});

export function useAuth(): AuthState {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ isAuthed: false, isLoading: true });

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("roadscout.token") : null;
    setState({ isAuthed: Boolean(token), isLoading: false });
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}
