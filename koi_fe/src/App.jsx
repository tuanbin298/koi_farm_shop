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
import IntroducePage from "./page/IntroducePage/IntroducePage";
import ProductDetail from "./page/ProductDetail/ProductDetail";
import SuccessPage from "./page/SuccessPage/SuccessPage";
import ConsignmentTrackingPage from "./page/ConsignmentTrackingPage/ConsignmentTrackingPage";
import KoiConsignment from "./page/KoiConsignment/KoiConsignment";
import ConsignmentDetail from "./page/ConsignmentDetail/ConsignmentDetail";
import Payment from "./page/payment/payment";
import FishCareService from "./page/FishCareService/FishCareService";
import Layout from "./component/Layout/Layout";
import Dashboard from "./page/Dashboard/Dashboard";
import MainLayout from "./MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
