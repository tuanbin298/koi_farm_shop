import React, { useState } from "react";
import { useParams } from "react-router-dom"; // To get product ID from the route
import { Flex } from "antd";
import { Image } from "antd";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { IoLocationSharp } from "react-icons/io5";
import { FaPhone, FaBookmark } from "react-icons/fa";
import "./ProductDetail.css";
import { Link } from "react-router-dom";
import { useProduct, useAllProducts } from "../api/Queries/product"; // Import custom hooks
import { formatMoney } from "../../utils/formatMoney";
import { CREATE_CART_ITEM } from "../api/Mutations/cart";
import toast, { Toaster } from "react-hot-toast";
import { useMutation } from "@apollo/client";

export default function ProductDetail() {
  // const [createCart] = useMutation(CREATE_CART);
  const [createCartItem] = useMutation(CREATE_CART_ITEM);
  const { id } = useParams(); // Get product ID from the route
  const { loading, error, product } = useProduct(id); // Fetch single product
  const { loading: allLoading, error: allError, products } = useAllProducts(); // Fetch all products for "Các sản phẩm khác"
  const userId = localStorage.getItem("id");
  const [cartId, setCartId] = useState(localStorage.getItem("cartId")); // Store cart ID in state and localStorage

  // State to track the starting index of the currently displayed products
  const [startIndex, setStartIndex] = useState(0);

  const productsPerPage = 4; // Number of products to display at a time
  const maxIndex = products ? products.length - productsPerPage : 0; // Maximum index we can start displaying

  if (loading || allLoading) return <p>Loading...</p>;
  if (error || allError)
    return <p>Error: {error?.message || allError?.message}</p>;

  // Get the subset of products to display based on the current startIndex
  const displayedProducts = products?.slice(
    startIndex,
    startIndex + productsPerPage
  );

  // Handler for next button
  const handleNext = () => {
    if (startIndex < products.length - 4) {
      setStartIndex(startIndex + 1);
    }
  };

  // Handler for previous button
  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const handleAddToCart = async () => {
    console.log(product.id);
    console.log(userId);
    console.log(cartId);
    console.log(localStorage.getItem("sessionToken"))
    if (!userId) {
      alert("User ID not found. Please log in.");
      return;
    }

    try {
      // Add item to the cart
      await createCartItem({
        variables: {
          data: {
            // price: product.price,
            quantity: 1,
            product: {
              connect: { id: product.id }, // Connect product by ID
            },
            user: {
              connect: {
                id: userId,
              },
            },
          },
        },
      });
      toast.success("Đã thêm vào giỏ hàng!", {
        icon: "🛒",
        style: {
          border: "1px solid #713200",
          padding: "16px",
          color: "#982B1C",
        },
        iconTheme: {
          primary: "#982B1C",
          secondary: "#FFFAEE",
        },
      });
    } catch (error) {
      if (error.message.includes("Access denied")) {
        alert(error);
        console.log(error);
      } else {
        console.error("Error adding item to cart:", error);
        alert("Failed to add item to cart. Please try again.");
      }
    }
  };

  return (
    <>
      <Box style={{ paddingTop: "1%", padding: "1%" }}>
        <Flex gap="large" justify="space-around">
          <div>
            {product.image?.publicUrl ? (
              <Image
                width={300}
                src={product.image.publicUrl}
                alt={product.name}
              />
            ) : null}
          </div>

          <div style={{ width: "100%" }}>
            <Typography
              variant="h3"
              gutterBottom
              style={{ fontWeight: "bold" }}
            >
              {product.name} {product.size}{" "}
              {new Date().getFullYear() - product.birth} tuổi
            </Typography>

            <Typography
              variant="body2"
              gutterBottom
              style={{
                fontFamily: "'Times New Roman', Times, serif",
                fontSize: "15px",
                fontWeight: "bold",
                color: "#982B1C",
                boxShadow: "10px 10px 18px -8px rgba(0,0,0,0.75)",
                border: "0.5px solid gray",
                textAlign: "center",
                padding: "1%",
                width: "40%",
                marginBottom: "4%",
              }}
            >
              GIÁ BÁN: {formatMoney(product.price)}
            </Typography>

            <Typography
              variant="body2"
              gutterBottom
              style={{ border: "2px dashed gray", padding: "15px" }}
            >
              {product.description}
            </Typography>

            <Stack spacing={0.5} className="productInfo">
              <div>
                Giới tính: {product.sex === "male" ? "Koi Đực" : "Koi Cái"}
              </div>
              <div>Năm sinh: {product.birth}</div>
              <div>Kích thước: {product.size}</div>
              <div>Chủng loại: {product.generic}</div>
              <div>Nguồn gốc: {product.origin}</div>
            </Stack>

            <Stack spacing={2} direction="row" className="productBtnGroup">
              <Button
                variant="outlined"
                color="primary"
                style={{ color: "#982B1C" }}
                onClick={handleAddToCart}
              >
                Thêm vào giỏ hàng
              </Button>
            </Stack>
          </div>
        </Flex>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        gap={3}
        justifyContent="center"
        alignItems="center"
        style={{
          backgroundColor: "#ebe8e8",
          paddingBottom: "3%",
          paddingTop: "3%",
          boxShadow: "10px 10px 18px -8px rgba(0,0,0,0.75)",
        }}
      >
        <div>
          <Typography
            variant="h4"
            style={{
              fontFamily: "'Brygada 1918'",
              border: "1px solid black",
              padding: "15px",
              backgroundColor: "#F9F9FF",
            }}
          >
            Các sản phẩm khác
          </Typography>
        </div>
        <div
          style={{
            display: "flex",
            gap: "100px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            className="slideBtn"
            style={{
              marginLeft: "3%",
              backgroundColor: "white",
              borderRadius: "50%",
            }}
          >
            <IconButton
              color="primary"
              onClick={handlePrev}
              disabled={startIndex === 0}
            >
              <ArrowBackIcon />
            </IconButton>
          </div>

          {displayedProducts?.map((product) => (
            <Link to={`/ProductDetail/${product.id}`} key={product.id}>
              <Card sx={{ maxWidth: 250 }}>
                {product.image?.publicUrl ? (
                  <CardMedia
                    component="img"
                    alt={product.name}
                    image={product.image.publicUrl}
                    style={{
                      aspectRatio: "1/3",
                      height: "375px",
                      width: "100%",
                    }}
                  />
                ) : null}
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    textAlign="center"
                    style={{
                      fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                      fontWeight: "450",
                    }}
                  >
                    {product.name}
                  </Typography>
                  <Typography
                    textAlign="center"
                    style={{
                      fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                      fontWeight: "450",
                    }}
                  >
                    {formatMoney(product.price)}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          ))}

          <div
            className="slideBtn"
            style={{
              marginRight: "3%",
              backgroundColor: "white",
              borderRadius: "50%",
            }}
          >
            <IconButton
              color="primary"
              onClick={handleNext}
              disabled={startIndex + productsPerPage >= products.length}
            >
              <ArrowForwardIcon />
            </IconButton>
          </div>
        </div>
      </Box>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}
