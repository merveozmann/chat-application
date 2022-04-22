import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Chat from './pages/chat/Chat';


const App = () => {
  return(
  <BrowserRouter>
  <Routes>
    <Route path='/register' element={<Register/>} />
    <Route path='/login' element={<Login/>}/>
    <Route path='/' element={<Chat/>}/>
  </Routes>
  </BrowserRouter>
  );
}

export default App