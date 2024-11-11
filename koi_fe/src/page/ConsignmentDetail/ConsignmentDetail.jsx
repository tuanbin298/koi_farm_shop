import React, { useState } from "react";
import { useParams } from "react-router-dom";
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
import "./ConsignmentDetail.css";
import { Link, useMatch } from "react-router-dom";
import { useConsignmentBySlug } from "../api/Queries/consignment";
import { formatMoney } from "../../utils/formatMoney";
import { CREATE_CART_ITEM } from "../api/Mutations/cart";
import toast, { Toaster } from "react-hot-toast";
import { useMutation, useQuery } from "@apollo/client";
import { useAllProducts, useProductBySlug } from "../api/Queries/product";
import { GET_CART_ITEMS } from "../api/Queries/cartItem";

export default function ConsignmentDetail() {
  const userId = localStorage.getItem("id");
  const [createCartItem] = useMutation(CREATE_CART_ITEM);
  const match = useMatch("/ConsignmentDetail/:id");
  const id = match ? match.params.id : null;

  const { data: cart, refetch: refetchCartItems } = useQuery(GET_CART_ITEMS, {
    variables: {
      where: {
        user: {
          id: {
            equals: userId,
          },
        },
      },
    },
    fetchPolicy: "network-only",
    skip: !userId,
  });

  const { slug } = useParams();
  console.log(slug);

  const { loading, error, product } = useConsignmentBySlug(slug);
  const { loading: allLoading, error: allError, products } = useAllProducts(); // Fetch all products for "Các sản phẩm khác"

  const [cartId, setCartId] = useState(localStorage.getItem("cartId"));

  // State to track the starting index of the currently displayed products
  const [startIndex, setStartIndex] = useState(0);

  const productsPerPage = 3;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Safeguard check for undefined products before using length
  const hasProducts = Array.isArray(products) && products.length > 0;

  // Handler for next button (pagination for products display)
  const handleNext = () => {
    if (hasProducts && startIndex < products.length - productsPerPage) {
      setStartIndex(startIndex + 1);
    }
  };

  // Handler for previous button (pagination for products display)
  const handlePrev = () => {
    if (hasProducts && startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  // Get the subset of products to display based on the current startIndex
  const displayedProducts = hasProducts
    ? products.slice(startIndex, startIndex + productsPerPage)
    : [];

  const handleAddToCart = async (consignmentId) => {
    if (!userId) {
      toast.error("Bạn cần đăng nhập để có thể thêm sản phẩm");
      return;
    }

    const productInCart = cart?.cartItems?.some(function (item) {
      return item.consignmentProduct[0]?.id === consignmentId;
    });
    if (productInCart) {
      toast.error("Sản phẩm này đã có trong giỏ hàng!");
      return;
    }

    try {
      await createCartItem({
        variables: {
          data: {
            quantity: 1,
            consignmentProduct: {
              connect: { id: product.id },
            },
            user: {
              connect: { id: userId },
            },
          },
        },
      });

      await refetchCartItems();
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
      <Toaster position="top-center" reverseOrder={false} />
      <div className="web-container">
        <Box style={{ paddingTop: "1%", padding: "1%" }}>
          <Flex gap="large" justify="space-around">
            <div>
              {product.photo?.image?.publicUrl ? (
                <Image
                  width={300}
                  src={product.photo.image.publicUrl}
                  alt={product.name}
                />
              ) : null}
              {console.log(product.slug)}
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
                <div>Chuyên mục: {product.category}</div>
              </Stack>

              <Stack spacing={2} direction="row" className="productBtnGroup">
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ color: "#982B1C" }}
                  onClick={() => handleAddToCart(product.id)}
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
              <Link to={`/ProductDetail/${product.slug}`} key={product.id}>
                <Card sx={{ maxWidth: 250 }}>
                  {product.photo?.image?.publicUrl ? (
                    <CardMedia
                      component="img"
                      alt={product.name}
                      image={product.photo.image.publicUrl}
                      style={{
                        aspectRatio: "1/3",
                        height: "250px",
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
                disabled={
                  !hasProducts ||
                  startIndex + productsPerPage >= products.length
                }
              >
                <ArrowForwardIcon />
              </IconButton>
            </div>
          </div>
        </Box>
      </div>
    </>
  );
}
