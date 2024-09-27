import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { FaArrowRight } from "react-icons/fa";

export default function CardProduct() {
  return (
    <Card
      sx={{ maxWidth: 345 }}
      style={{
        marginBottom: "5%",
        marginLeft: "17%",
        boxShadow: "21px 17px 48px -7px rgba(0,0,0,0.75)",
      }}
    >
      <CardMedia
        image="src/assets/koiimgnews.jfif"
        title="green iguana"
        style={{
          aspectRatio: "4/3",
        }}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Hiện tượng cá Koi nổi đầu – Nguyên nhân và cách khắc phục nhanh nhất
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Cá Koi nổi đầu chính là một trong những hiện tượng thường gặp ở cá Koi
          và chúng khá là nguy hiểm. Người nuôi cá cần phải có những biện pháp
          khắc phục kịp thời để tránh gây ra những hậu quả nghiêm trọng. Vậy,
          nguyên nhân và cách khắc phục hiện tượng này như thế nào? Các bạn hãy
          cùng ISHI Koi Farm khám phá qua bài viết dưới đây.
        </Typography>
      </CardContent>
      <CardActions
        style={{
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <div className="addToCartBtn">
          <Button variant="contained" color="error">
            Đọc thêm
            <FaArrowRight />
          </Button>
        </div>
      </CardActions>
    </Card>
  );
}
