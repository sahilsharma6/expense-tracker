import { useState, useEffect, createContext, useContext } from "react";
import api from "../services/Api";

export const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useAuthProvider() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    setUser(currentUser);
    setLoading(false);
  }, []);

  const signIn = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    if (!response.data || !response.data.token) {
      throw new Error("Invalid credentials");
    }
    console.log(response.data);
    localStorage.setItem("token", response.data.token);
    const user = response.data.user;
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const signUp = async (username, email, password, role) => {
    const response = await api.post("/auth/register", {
      username,
      email,
      password,
      role,
    });
    if (!response.data || !response.data.token) {
      throw new Error("Invalid credentials");
    }
    localStorage.setItem("token", response.data.token);
    const user = response.data.user;
    setUser(user);
  };

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };
}
