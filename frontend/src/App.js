import logo from './logo.svg';
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 

import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";


function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser); 
    }
  }, []);
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
