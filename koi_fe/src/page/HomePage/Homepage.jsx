import React from "react";
import { FaArrowRight } from "react-icons/fa";
import Button from "@mui/material/Button";
import "./HomePage.css";
import CardProduct from "../../component/Card/CardProduct";
import CardNews from "../../component/CardNews/CardNews";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";

export default function Homepage() {
  return (
    <>
      <div className="banner">
        <div className="banner-content">
          <h1>CaKoiViet Koi Farm Shop</h1>
          <h2>Chất lượng và niềm tin</h2>
          <Button variant="contained" color="error">
            <a href="#" className="btn-banner">
              Các giống cá Koi được bán
            </a>
          </Button>
        </div>
      </div>
      <section className="introduction-section">
        <div className="introduction-content">
          <div className="text-section">
            <h2>Giới thiệu về chúng tôi</h2>
            <p>
              Với mục tiêu kết nối những người yêu thích cá Koi, trang web chia
              sẻ các bài viết về cách nuôi dưỡng, chăm sóc, và bảo vệ sức khỏe
              cá Koi. Ngoài ra, CaKoiViet còn giới thiệu các giống cá Koi nổi
              bật và những mẹo hữu ích cho người chơi cá cảnh.
            </p>
          </div>
          <div className="image-section">
            <img src="src/assets/koiIntro.jfif" />
          </div>
        </div>
      </section>
      <section className="species-section">
        <h3>Các giống Cá Koi</h3>
        <p>Cá koi thuần chủng nhập khẩu, lai F1, thuần Việt...</p>
        <div className="productList">
          <Container>
            <CardProduct />
          </Container>
        </div>
      </section>

      {/* Header Button */}
      <header className="headerShowMoreButton">
        <Button
          variant="outlined"
          color="error"
          className="viewMoreButton"
          component={Link} // Use Link as the component for Button
          to="/koiList" // Specify the path for navigation
        >
          Xem thêm <FaArrowRight />
        </Button>
      </header>

      {/* News Section */}
      <section className="news">
        <div className="newsSection">
          <div>
            <h2 className="title">Tin Tức</h2>
            <h3 className="subtitle">Kiến thức và kinh nghiệm nuôi cá Koi</h3>
          </div>
          <div>
            <Button variant="outlined" color="light" className="viewMoreButton">
              Xem thêm <FaArrowRight />
            </Button>
          </div>
        </div>
        <Container>
          <CardNews />
        </Container>
      </section>

      {/* Quote Section */}
      <section className="quoteSection">
        <h2>Một câu trích dẫn từ Kodama Koi Farm</h2>
        <div className="quoteContent">
          <img
            src="src/assets/kodama.jfif"
            alt="Taro Kodama"
            className="quoteImage"
          />
          <p className="quoteText">
            <div>
              "What we all have in common here is that koi give us peaceful joy
              within our fast-paced and often busy lives, which is the sad
              reality of modern society in our world. We want to bring peace and
              tranquility to the United States through koi."
            </div>
            <div className="author">
              Taro Kodama, President, Kodama Koi Farm
            </div>
          </p>
        </div>
      </section>
    </>
  );
}
