import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from "./components/PrivateRoute";
import Register from "./components/Register";
import Login from "./components/Login";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import ShortenUrlPage from "./components/ShortenUrlPage";


const AppRouter = ()=>{

    return(
         <Routes>
    
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardLayout />} />
        <Route path="/s/:url" element={<ShortenUrlPage />} />

        

       
        {/* <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        /> */}
      </Routes>
    )
}

export default AppRouter;


export const SubDomainRouter = () => {
    return (
        <Routes>
          <Route path="/:url" element={<ShortenUrlPage />} />
        </Routes>
    )
}