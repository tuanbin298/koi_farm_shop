import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./page/HomePage/Homepage";
import Header from "./component/Header/Header";
import Footer from "./component/Footer/Footer";
import Login from "./page/LoginPage/LoginPage";
import RegisterPage from "./page/RegisterPage/RegisterPage";
import CareConsignmentPage from "./page/CareConsignmentPage/CareConsignmentPage";
import SalesConsignmentPage from "./page/SalesConsignmentPage/SalesConsignmentPage";
import KoiListPage from "./page/KoiListPage/KoiListPage";
import Checkout from "./page/Checkout/Checkout";
import CartPage from "./page/CartPage/CartPage";
import ProfileUser from "./page/ProfileUser/ProfileUser";
import NewsArticle from "./page/NewsArticle/NewsArticle";
import Introduce from "./page/IntroducePage/IntroducePage";


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
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/sales" element={<SalesConsignmentPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/koiList" element={<KoiListPage />} />
          <Route path="/koiList/:categoryId" element={<KoiListPage />} />
          <Route path="/news" element={<NewsArticle />} />
          <Route path="/profile" element={<ProfileUser />} />
          <Route path="/introduce" element={<InntroducePage />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  );
}

export default App;
