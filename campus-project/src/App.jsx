import React, { useState } from "react";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import "./styles.css";

function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      {user ? (
        <Dashboard user={user} setUser={setUser} />
      ) : (
        <Login setUser={setUser} />
      )}
    </>
  );
}

export default App;