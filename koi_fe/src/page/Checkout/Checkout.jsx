import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import "./Checkout.css";
import { Button, Flex, Radio, Space, Image } from "antd";
import { Link } from "react-router-dom";
import { CREATE_ORDER, UPDATE_ORDER } from ".././api/Mutations/order";
import { CREATE_ORDER_ITEMS } from ".././api/Mutations/orderItem";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CART_ITEMS } from "../api/Queries/cartItem";
import { DELETE_CART_ITEM } from "../api/Mutations/deletecartItem";
import toast, { Toaster } from "react-hot-toast";
import { formatMoney } from "../../utils/formatMoney";
import { GET_ORDER_ITEM_ID } from "../api/Queries/orderItem";
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  ListItemAvatar,
  Avatar,
  Pagination,
  darken,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();
  const [deleteCartItem] = useMutation(DELETE_CART_ITEM);
  const [updateOrder] = useMutation(UPDATE_ORDER);
  const userId = localStorage.getItem("id");
  const [orderItemsData, setOrderItemsData] = useState([]);
  const [linkOrderId, setLinkOrderId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("full");
  const {
    loading,
    error,
    data: cartItems,
    refetch: refetchItems,
  } = useQuery(GET_CART_ITEMS, {
    variables: {
      where: {
        user: { id: { equals: userId } },
      },
    },
  });

  const { data: orderItemIDs, refetch: refetchOrderItems } = useQuery(
    GET_ORDER_ITEM_ID,
    {
      variables: {
        where: {
          order: { id: { equals: linkOrderId } }, // Use the orderId state here
        },
      },
      skip: !linkOrderId, // Skip the query until the orderId is set
    }
  );
  console.log(orderItemIDs);
  const [orderData, setOrderData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    paymentMethod: "",
  });

  const [createOrder] = useMutation(CREATE_ORDER);
  const [createOrderItems] = useMutation(CREATE_ORDER_ITEMS);

  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [phone, setPhone] = useState(localStorage.getItem("phone") || "");
  const [address, setAddress] = useState(localStorage.getItem("address") || "");

  const checkoutOption1 = [
    { label: "Thanh toán hết", value: "full" },
    { label: "Thanh toán khi nhận hàng (đặt cọc 50%)", value: "cod" },
  ];

  const handleInputChange = (e) => {
    setOrderData({
      ...orderData,
      [e.target.name]: e.target.value,
    });
  };
  let totalPrice = 0;
  cartItems.cartItems?.forEach((cartItem) => {
    if (cartItem.product.length > 0) {
      totalPrice += cartItem.product[0].price;
    } else if (cartItem.consignmentProduct) {
      totalPrice += cartItem.consignmentProduct[0].price;
    }
  });

  const handleCreateOrder = async () => {
    navigate(`/payment?paymentMethod=${paymentMethod}`);
  };

  const [page, setPage] = useState(1); // Current page
  const itemsPerPage = 3; // Items per page
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems =
    cartItems?.cartItems?.slice(startIndex, endIndex) || [];

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="checkOutInfo" style={{ padding: "20px" }}>
        <section className="TitleSection">
          <h3>Thông tin giao/nhận hàng</h3>
        </section>
        <Box>
          <Flex gap="large">
            <TextField
              id="name"
              label="Họ và tên"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "40%" }}
              required
            />
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "30%" }}
              required
            />
            <TextField
              id="phone"
              label="Số điện thoại"
              variant="outlined"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ width: "25%" }}
              required
            />
          </Flex>
        </Box>

        <Box style={{ marginTop: "2%" }}>
          <Flex gap="large">
            <TextField
              id="address"
              label="Địa chỉ"
              variant="outlined"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ width: "98%" }}
              required
            />
          </Flex>
        </Box>

        <Box style={{ marginTop: "2%" }}>
          <Flex gap="large">
            <TextField
              id="outlined-basic"
              label="Nhập tỉnh/thành"
              variant="outlined"
              style={{ width: "25%" }}
              name="city"
              onChange={handleInputChange}
              required
            />
            <TextField
              id="outlined-basic"
              label="Nhập quận/huyện"
              variant="outlined"
              style={{ width: "25%" }}
              name="district"
              onChange={handleInputChange}
              required
            />
            <TextField
              id="outlined-basic"
              label="Nhập phường/xã"
              variant="outlined"
              style={{ width: "25%" }}
              name="ward"
              onChange={handleInputChange}
              required
            />
          </Flex>
        </Box>
        <Flex justify="space-between">
          <div className="OrderSection">
            <section className="OrderTitleSection">
              <h3>Thông tin đơn hàng</h3>
            </section>
            <List>
              {paginatedItems.map((item, index) => (
                <div key={index}>
                  <ListItem>
                    <ListItemAvatar>
                      <Image
                        width={75}
                        src={
                          item.product[0]?.image?.publicUrl ||
                          item.consignmentProduct[0]?.photo?.image?.publicUrl ||
                          ""
                        }
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        item.product[0]?.name ||
                        item.consignmentProduct[0]?.name
                      }
                      secondary={`Giá: ${
                        item.product[0]?.price ||
                        item.consignmentProduct[0]?.price
                      } VND`}
                    />
                  </ListItem>
                  <Divider />
                </div>
              ))}
              <Box display="flex" justifyContent="center" marginTop={2}>
                <Pagination
                  count={Math.ceil(
                    (cartItems?.cartItems?.length || 0) / itemsPerPage
                  )}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
              {cartItems?.cartItems?.length === 0 && (
                <Typography variant="body2">Giỏ hàng trống</Typography>
              )}
            </List>
          </div>

          <div className="checkoutSection">
            <section className="TitleFlexSection">
              <h3>Phương thức thanh toán</h3>
            </section>
            <Flex direction="column" gap="middle">
              <Radio.Group
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  setOrderData({ ...orderData, paymentMethod: e.target.value });
                }}
                required
              >
                <Space direction="vertical">
                  {checkoutOption1.map((option) => (
                    <Radio value={option.value}>{option.label}</Radio>
                  ))}
                </Space>
              </Radio.Group>
            </Flex>
          </div>
        </Flex>

        <Flex
          style={{
            marginTop: "6%",
            justifyContent: "space-between",
            padding: "15px",
          }}
        >
          <div>
            <Link to="/cart">
              <Button
                color="danger"
                variant="solid"
                style={{ padding: "20px", fontSize: "20px" }}
              >
                Quay lại giỏ hàng
              </Button>
            </Link>
          </div>
          <div>
            <Button
              variant="solid"
              style={{
                backgroundColor: "green",
                color: "white",
                padding: "20px",
                fontSize: "20px",
              }}
              onClick={handleCreateOrder}
            >
              Đặt hàng
            </Button>
          </div>
        </Flex>
      </div>
    </>
  );
}
