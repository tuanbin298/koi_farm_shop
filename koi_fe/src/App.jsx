import Homepage from "./page/HomePage/Homepage";
import Header from "./component/Header/Header";
import Footer from "./component/Footer/Footer";
import Login from "./page/LoginPage/LoginPage";
import RegisterPage from "./page/RegisterPage/RegisterPage";
import CareConsignmentPage from "./page/CareConsignmentPage/CareConsignmentPage";
import SalesConsignmentPage from "./page/SalesConsignmentPage/SalesConsignmentPage";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Checkout from "./page/Checkout/Checkout";

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
<<<<<<< HEAD
          <Route path="/checkout" element={<Checkout/>}/>
=======
          <Route path="/sales" element={<SalesConsignmentPage />} />
>>>>>>> 2b938d52f374c3664e1e6475e84904b3394424c4
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  );
}

export default App;
