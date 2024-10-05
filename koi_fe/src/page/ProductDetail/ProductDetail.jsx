import React from 'react'
import { Flex } from 'antd';
import { Image } from 'antd';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { IoLocationSharp } from "react-icons/io5";
import { FaPhone } from "react-icons/fa6";
import { FaBookmark, FaRegArrowAltCircleLeft, FaRegArrowAltCircleRight } from "react-icons/fa";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import "./ProductDetail.css"



export default function ProductDetail() {
  const products = [
    { name: 'Koi Asagi', image: 'src/assets/kohaku.jpg' },  // Replace with actual image paths
    { name: 'Koi Tancho', image: 'src/assets/kohaku.jpg' },
    { name: 'Koi Shiro Utsuri', image: 'src/assets/kohaku.jpg' },
    { name: 'Koi Kohaku', image: 'src/assets/kohaku.jpg' }
  ];  
  return (
    <>
    <Box style={
      {
        marginTop: "1%",
        padding: "1%"
      }
    }>
      <Flex gap="large" justify='space-around'>
          <div>
          <Image
          width={300}
          src="src/assets/kohaku.jpg"
            />    
          </div>

          <div style={{
            width:"100%"
          }}>
              <Typography variant="h3" gutterBottom style={
                {
                  fontWeight:"bold"
                }
              }>
            Koi Showa 97cm 5 tuổi
            </Typography>
            <Typography variant="body2" gutterBottom style={{
              fontFamily:"'Times New Roman', Times, serif",
              fontSize:"15px",
              fontWeight:"bold",
              color: "#982B1C",
              boxShadow: "10px 10px 18px -8px rgba(0,0,0,0.75)",
              border:"0.5px solid gray",
              textAlign: "center",
              padding: "1%",
              width: "40%",
              marginBottom: "4%",
              marginLeft: "7%"
            }}>
              GIÁ BÁN: 8,000,000 VNĐ
            </Typography>
            <Typography variant="body2" gutterBottom style={{
              border:"2px dashed gray",
              padding: "15px"
            }}>
              Em koi showa 97 cm 5 tuổi thuộc dòng jumbo với kích thước rất khủng. 
              Vì vậy, màu sắc, hoa văn, hình thể của em ấy đạt đến chuẩn mực cao. 
              Đây là em showa được CaKoiViet nhập về trực tiếp từ Dainichi Koi farm, đã nuôi dưỡng đủ 6 tháng khỏe mạnh, vạm vỡ.
            </Typography>

            <Stack spacing={0.5} className='productInfo'>
              <div>
                Giới tính: Koi Cái
              </div>

              <div>
                 Năm sinh: 2016
              </div>
              
              <div> 
                Kích thước: 97 cm
              </div>

              <div> 
                Chủng loại: Cá Koi Showa
              </div>

              <div> 
                Nguồn gốc: Cá nhập khẩu
              </div>
            </Stack>
            <Stack spacing={2} direction="row" className='productBtnGroup'>
              <Button variant="outlined" color="primary" style={{
                color:"#982B1C"
              }}>Thêm vào giỏ hàng</Button>
              <Button variant="contained" color="secondary">Mua Ngay</Button>
            </Stack>
          </div>


          <div style={{
            width: "80%"
          }}>
          <Typography variant="body2" style={{
            border: "1px solid",
            backgroundColor: "#982B1C",
            color: "white",
            padding: "20px",
            textAlign: "center",
            fontFamily: "Brygada 1918, serif",
            fontSize: "20px",
            fontWeight: "bold"
          }}>
            THÔNG TIN LIÊN HỆ
          </Typography> 
          <Typography variant="body2" style={{
            border: "1px solid",
            padding: "20px"
          }}>
            <Stack spacing={2}>
              <div className='infoRow'>

                <div className='infoIcon'><IoLocationSharp /></div> C5 C7 đường số 12, P.Hưng Phú 1, Q. Cái Răng, TP Cần Thơ.

              </div>
              <div className='infoRow'>

                <div className='infoIcon'><FaPhone /></div> 0864284671

              </div>
              <div className='infoRow'> 

                <div className='infoIcon'><FaBookmark /> </div>Hotrocakoiviet@gmail.com
                
              </div>
            </Stack>
          </Typography>
          </div>
        </Flex>
      </Box>
      <Box display="flex" flexDirection="column" gap={3} justifyContent="center" alignItems="center"
      style={{
        backgroundColor: "#ebe8e8",
        paddingBottom:"3%",
        paddingTop:"3%",
        boxShadow: "10px 10px 18px -8px rgba(0,0,0,0.75)"
      }}> 
        <div>
          <Typography variant='h4' style={{
            fontFamily: "'Brygada 1918'",
            border:"1px solid black",
            padding: "15px",
            backgroundColor:"#F9F9FF"
          }}>
            Các sản phẩm khác
          </Typography>
        </div>
        <div style={{
          display: "flex",
          gap:"100px",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <div className="slideBtn" style={{
            marginLeft: "3%",
            backgroundColor: "white",
            borderRadius:"50%"
          }}>
            <IconButton color="primary">
              <ArrowBackIcon/>
            </IconButton>
          </div>
          {products.map((product) =>
          <Link>
          <Card sx={{ maxWidth: 250 }}>
          <CardMedia
            component="img"
            alt="green iguana"
            image={product.image}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div" textAlign="center"
            style={{
              fontFamily:"'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              fontWeight:"450"
            }}>
              {product.name}
            </Typography>
          </CardContent>
        </Card>
        </Link> 
          )}
        <div className="slideBtn" style={{
          marginRight:"3%",
          backgroundColor: "white",
          borderRadius:"50%"
        }}>
          <IconButton color="primary">
            <ArrowForwardIcon />
          </IconButton>
        </div>
        </div>
      </Box>
    </>
  )
}
