import React, { useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import Button from "@mui/material/Button";
import "./HomePage.css";
import CardProduct from "../../component/Card/CardProduct";
import CardNews from "../../component/CardNews/CardNews";
import Container from "react-bootstrap/Container";
import { Link, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Typography, Pagination } from "@mui/material";
import { Flex } from "antd";
import Feedback from "../../component/Feedback/Feedback"

export default function Homepage() {
  const location = useLocation();
  useEffect(() => {
    if (location.state?.fromLogin) {
      toast.success("Đăng nhập thành công!", {
        style: {
          border: "1px solid #713200",
          padding: "16px",
          color: "#21bf21",
        },
        iconTheme: {
          primary: "#21bf21",
          secondary: "#FFFAEE",
        },
      });
    }
  }, [location.state]);
  return (
    <>
    <div className="web-container">
      <div className="banner">
        <div className="banner-content">
          <h1>CaKoiViet Koi Farm Shop</h1>
          <h2>Chất lượng và niềm tin</h2>
          <Button variant="contained" color="error" style={{
            padding:"15px"
          }}>
            <Link to="/koiList">
              Các giống cá Koi được bán
              </Link>
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

      <section className="serviceSection">
        <div className="titleServiceSection">
          <p style={{
            borderBottom:"3px solid white",
            width:"35%",
            marginBottom:"1%",
            marginLeft: "20px",
            fontSize: "2rem",
            fontWeight:"bold"
          }}>Dịch vụ ký gửi cá Koi</p>
          <p variant="body1" style={{
            lineHeight:"40px",
            marginLeft: "20px",
            fontSize: "1.2rem"
          }}>
            Chúng tôi cung cấp dịch vụ ký gửi nuôi cá và ký gửi bán cá, giúp bạn chăm sóc và phân phối cá của mình trong một môi trường chuyên nghiệp và an toàn.
          </p>
          <Flex justify="space-around" style={{
            marginTop:"3%"
          }}>

            <div className="leftSubService">
              <Typography variant="h4" style={{
                textAlign:"center",
                marginBottom:"2%",
                lineHeight:"35px"
              }} className="titleLeftSubService">Ký gửi nuôi cá</Typography>

              <Typography variant="body1" style={{
                textAlign:"center",
                padding:"15px",
                lineHeight:"35px"
              }}>Dịch vụ ký gửi nuôi cá đảm bảo các loại cá của bạn được chăm sóc và nuôi dưỡng trong môi trường sạch sẽ, an toàn và được giám sát kỹ lưỡng bởi các chuyên gia.</Typography>


              <Typography style={
                {
                  display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column"
                }
              }>
                <Button variant="contained" style={{
                  backgroundColor:"#3192C8",
                  padding:"15px"
                }}><Link to="/care">Xem hướng dẫn ký gửi nuôi cá <FaArrowRight/></Link></Button>
              </Typography>
            </div>

            <div className="rightSubService">
              <Typography variant="h4" style={{
                textAlign:"center",
                marginBottom:"2%",
                lineHeight:"35px"
              }} className="titleRightSubService">Ký gửi bán cá</Typography>


              <Typography variant="body1" style={{
                textAlign:"center",
                padding: "15px",
                lineHeight:"35px"
              }}>Chúng tôi cung cấp dịch vụ ký gửi bán cá, 
              giúp bạn tiếp cận với thị trường rộng lớn và bán cá của mình một cách hiệu quả thông qua hệ thống của chúng tôi.</Typography>


              <Typography style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column"
              }}><Button variant="contained" style={{
                backgroundColor: "#3192C8",
                padding:"15px"
              }}><Link to="/sales">Xem hướng dẫn ký gửi bán cá <FaArrowRight/></Link></Button></Typography>
            </div>

          </Flex>
        </div>
      </section>

      {/* News Section */}
      <section className="news">
        <div className="newsSection">
          <div>
            <h2 className="title">Tin Tức</h2>
            <h3 className="subtitle">Kiến thức và kinh nghiệm nuôi cá Koi</h3>
          </div>
          <div>
            <Link to="/news">
              <Button
                variant="outlined"
                color="light"
                className="viewMoreButton"
              >
                Xem thêm <FaArrowRight />
              </Button>
            </Link>
          </div>
        </div>
        <Container>
          <CardNews />
        </Container>
      </section>
      <Feedback />
      </div>
    </>
  );
}
