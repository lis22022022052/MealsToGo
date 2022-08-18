import React, { useState, createContext } from "react";

import {
  logout,
  loginRequest,
  registerRequest,
  useAuthStateChanged,
} from "./authentication.service";

export const AuthenticationContext = createContext();

export const AuthenticationContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useAuthStateChanged((u) => {
    if (u) {
      setUser(u);
      setIsLoading(false);
    } else {
      setUser(null);
    }
  });

  const onLogin = (email, password) => {
    setIsLoading(true);
    if (email === "") {
      setError("Email field is empty");
      setIsLoading(false);
      return;
    } else if (password === "") {
      setError("Password field is empty.");
      setIsLoading(false);
      return;
    }

    loginRequest(email, password)
      .then((u) => {
        setUser(u);
        setIsLoading(false);
      })
      .catch((e) => {
        let text = "error";
        if (e.code === "auth/invalid-email") {
          text = "You put invalid email.";
        } else if (e.code === "auth/user-not-found") {
          text = "Your email or password is invalid.";
        } else {
          text = e.toString();
        }
        setIsLoading(false);
        setError(text);
      });
  };

  const onRegister = (email, password, repeatedPassword) => {
    setIsLoading(true);
    if (password !== repeatedPassword) {
      setError("Error: Passwords do not match");
      setIsLoading(false);
      return;
    }
    registerRequest(email, password)
      .then((u) => {
        setUser(u);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        setError(e.toString());
      });
  };

  const onLogout = () => {
    setUser(null);
    logout();
  };

  const onCleanError = () => {
    setError(null);
  };

  return (
    <AuthenticationContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        isLoading,
        error,
        onCleanError,
        onLogin,
        onRegister,
        onLogout,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
