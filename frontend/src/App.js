import logo from './logo.svg';
import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 

import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
