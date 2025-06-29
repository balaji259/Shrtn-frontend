import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import PrivateRoute from "./components/PrivateRoute";
import Register from "./components/Register";
import Login from "./components/Login";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import ShortenUrlPage from "./components/ShortenUrlPage";
import Navbar from "./components/Navbar";


const AppRouter = ()=>{

      const location = useLocation();
  
  // Define paths where Navbar should be hidden
  const hideNavbarPaths = ['/', '/register'];

  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

    return(

      <>

      {shouldShowNavbar && <Navbar />}

      
         <Routes>
       
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        {/* <Route path="/navbar" element={<Navbar />} /> */}

        
        {/* <Route path="/dashboard" element={ <DashboardLayout />} /> */}

        <Route path="/s/:url" element={<ShortenUrlPage />} />

        

       
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        />
      </Routes>
      </>
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