"use client"
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const loginUser = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
      // Solo se ejecutará en el cliente
    if (global?.window !== undefined) {
      window?.localStorage?.setItem("user", JSON.stringify(userData));
      window?.localStorage?.setItem("token", authToken);
    }
      // window?.localStorage?.setItem("user", JSON.stringify(userData))
    // window?.localStorage?.setItem("token", authToken)
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    if (global?.window !== undefined) {
      // Solo se ejecutará en el cliente
      window?.localStorage?.clear();
    }
    // window?.localStorage?.clear();
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
