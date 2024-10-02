import Homepage from "./page/HomePage/Homepage";
import Header from "./component/Header/Header";
import Footer from "./component/Footer/Footer";
import Login from "./page/LoginPage/LoginPage";
import RegisterPage from "./page/RegisterPage/RegisterPage";
import CareConsignmentPage from "./page/CareConsignmentPage/CareConsignmentPage";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Checkout from "./page/Checkout/Checkout";
import CartPage from "./page/CartPage/CartPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="/care" element={<CareConsignmentPage />} />
          <Route path="/checkout" element={<Checkout/>}/>
          <Route path="/cart" element={<CartPage/>}/>
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  );
}

export default App;
