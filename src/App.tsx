import React from "react";
import { Routes, Route } from "react-router";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Dashboard from "./pages/dashboard/Dashboard";
const App = () => {
  return (
    <Routes>
      <Route index element={<Login />} />
      <Route path="register" element={<Signup />} />
      <Route path="dashboard" element={<Dashboard />} />
    </Routes>
  );
};

export default App;
