"use client"
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const loginUser = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);

    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("token", authToken)
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);

    localStorage.clear();
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
