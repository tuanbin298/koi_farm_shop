import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { FaCartShopping } from "react-icons/fa6";
import { GET_PRODUCT } from "../../page/api/Queries/product";
import { useQuery, gql } from "@apollo/client";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { Link, useLocation } from "react-router-dom";
import "../../component/Card/CardProduct.css";
import { formatMoney } from "../../utils/formatMoney";

//Defined new component use styled
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2, //apply all font from theme
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary, //apply secondary color from theme
}));

export default function CardProduct() {
  const {
    data: productData,
    loading: productLoading,
    error: productError,
  } = useQuery(GET_PRODUCT, {
    variables: { take: 6 },
  });
  console.log(productData);

  if (productLoading) return <p>Loading ...</p>;
  if (productError) return <p>Error loading products.</p>;
  return (
    <div className="listitem">
      <div className="content">
        {productData &&
          productData.products.map((product) => (
            <Item key={product.id}>
              <Link to={`/ProductDetail/${product.id}`}>
                <div className="detail">
                  {product.image?.publicUrl && (
                    <img
                      src={product.image.publicUrl}
                      alt={product.name}
                      className="image"
                    />
                  )}
                  <div className="product_info">
                    <h4>{product.name}</h4>
                    <div>{formatMoney(product.price)}</div>
                    <div>{product.origin}</div>
                    <div>{product.sex}</div>
                    <div>{product.generic}</div>
                    <button className="button">Xem thêm</button>
                  </div>
                </div>
              </Link>
            </Item>
          ))}
      </div>
    </div>
  );
}
