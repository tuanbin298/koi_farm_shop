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
import FishCareServide from "./page/FishCareService/FishCareService";
import Layout from "./component/Layout/Layout";
import Dashboard from "./page/Dashboard/Dashboard";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Layout>
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
            <Route path="/introduce" element={<IntroducePage />} />
            <Route path="/ProductDetail/:slug" element={<ProductDetail />} />
            <Route
              path="/ConsignmentDetail/:slug"
              element={<ConsignmentDetail />}
            />
            <Route path="/someSuccessPage" element={<SuccessPage />} />
            <Route
              path="/consignmentTracking"
              element={<ConsignmentTrackingPage />}
            />
            <Route path="/consignmentList" element={<KoiConsignment />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/fishcareservice" element={<FishCareServide />} />
            <Route path="/dashboard" element={<Dashboard/>}/>


          </Routes>
        </Layout>
      </BrowserRouter>
      <Footer />
    </>
  );
}

export default App;
