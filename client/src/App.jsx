import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Home from './Pages/Home/Home';
import Signin from './Pages/Sign/Signin';
import Signup from './Pages/Sign/Signup';
import Profile from './Pages/Sign/Profile';
import PendingApproval from './Pages/Admin/PendingApproval';
import ForgetPassword from './Pages/Sign/ForgetPassword';
import PasswordReset from './Pages/Sign/PasswordReset';
import Error from './Pages/Error/Error';
import Model from './Pages/Detect/Model';


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/signin' element={<Signin/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/profile' element={<Profile/>}/>
      <Route path='/pendingApproval' element={<PendingApproval/>}/>
      <Route path='/forgotPassword/:resetToken' element={<ForgetPassword/>}/>
      <Route path='/passwordReset' element={<PasswordReset/>}/>
      {/* <Route path='/livedetect' element={<Model/>}/> */}
      <Route path='*' element={<Error/>}/>
    </Routes>
    </BrowserRouter>
    
  )
}

export default App
