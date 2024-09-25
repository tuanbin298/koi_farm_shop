import { useState } from "react";
import Homepage from "./page/HomePage/Homepage";
import Header from "./component/Header/Header";
import Footer from "./component/Footer/Footer"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./page/LoginPage/LoginPage";
import RegisterPage from "./page/RegisterPage/RegisterPage";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
    
    
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/" element={<Homepage />}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="register" element={<RegisterPage/>}/>
      </Routes>
    </BrowserRouter>
      <Footer/>
    </>
  );
}

export default App;
