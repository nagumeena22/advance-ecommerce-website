import { Route, Routes } from "react-router-dom";
import React from "react";
import { Navbar } from "./Components/Navbar/Navbar";
import { Admin } from "./Pages/Admin/Admin";
import AdminLogin from "./Pages/Admin/AdminLogin";
import { AddProduct } from "./Components/AddProduct/AddProduct";
import { ListProduct } from "./Components/ListProduct/ListProduct";

export const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
         <Route path='/addproduct' element={<AddProduct/>}/>
          <Route path='/listproduct' element={<ListProduct/>}/>
        {/* Optional: default route */}
        <Route path="/" element={<AdminLogin />} />
      </Routes>
    </div>
  );
};
