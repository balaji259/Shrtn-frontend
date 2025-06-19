import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from "./components/PrivateRoute";
import Register from "./components/Register";
import Login from "./components/Login";
import DashboardLayout from "./components/dashboard/DashboardLayout";
function App() {
  return (
    <BrowserRouter>
      <Routes>
    
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardLayout />} />
        

       
        {/* <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
