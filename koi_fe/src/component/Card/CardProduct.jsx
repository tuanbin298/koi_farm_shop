import React from 'react'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { FaCartShopping } from "react-icons/fa6";
export default function CardProduct() {
  return (
    <Card sx={{ maxWidth: 345 }} style={{
      marginBottom: "5%",
      marginLeft:"17%",
      boxShadow:"21px 17px 48px -7px rgba(0,0,0,0.75)"
    }}>
      <CardMedia
        image="src/assets/kohaku.jpg"
        title="green iguana"
        style={{
          aspectRatio: "2/3"
        }}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Cá Koi Kohaku
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Size: 15 cm - 90 cm<br/>
        Nguồn gốc: Sakai,Matsue,Momotaro<br/>
        Chất lượng: Đẹp, Xuất sắc<br/>
        Loại: Thuần chủng Nhật Bản<br/>
        Xuất xứ: Nhật Bản
        </Typography>
      </CardContent>
      <CardActions style={{
        marginLeft:"19%"
      }}>
      <div className='addToCartBtn'><Button variant="contained" color="success">Thêm vào giỏ hàng <FaCartShopping /></Button></div>
      </CardActions>
    </Card>
  )
}
