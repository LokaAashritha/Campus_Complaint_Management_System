import React, { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import "./Styles.css";

const TOKEN_STORAGE_KEY = "student_token";
const USER_STORAGE_KEY = "student_user";

function getStoredUser() {
  try {
    const rawUser = localStorage.getItem(USER_STORAGE_KEY);

    if (!rawUser) {
      return null;
    }

    return JSON.parse(rawUser);
  } catch {
    return null;
  }
}

function App() {
  const [user, setUser] = useState(getStoredUser);

  const handleAuthSuccess = ({ token, user: loggedInUser }) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  };

  return (
    <>
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <Login onAuthSuccess={handleAuthSuccess} />
      )}
    </>
  );
}

export default App;