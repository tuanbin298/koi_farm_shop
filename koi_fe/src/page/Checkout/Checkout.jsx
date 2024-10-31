import React, { useEffect, useState } from 'react';
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
import { useLocation, useNavigate } from 'react-router-dom';
export default function Checkout() {
  const navigate = useNavigate();
  const [deleteCartItem] = useMutation(DELETE_CART_ITEM);
  const [updateOrder] = useMutation(UPDATE_ORDER);
  const userId = localStorage.getItem("id");
  const [orderItemsData, setOrderItemsData] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [dates, setDates] = useState({});
  const [linkOrderId, setLinkOrderId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("full");
  const today = new Date().toISOString().split('T')[0]; // Ngày hiện tại
  const location = useLocation();
  const [totalCarePrice, setTotalCarePrice] = useState(0);
  const [depositsArray, setDepositsArray] = useState([]);
  useEffect(() => {
    if (location.state && location.state.selectedProducts) {
        setSelectedProducts(location.state.selectedProducts);
        setDates(location.state.dates);
        setTotalCarePrice(location.state.totalCarePrice)
        setDepositsArray(location.state.depositsArray);
    }
}, [location.state]); 
  console.log(selectedProducts);
  console.log(dates);
  console.log(totalCarePrice);
  
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
  const [errors, setErrors] = useState({}); // Error state for each field

  // Function to validate each field
  const validateFields = () => {
    const newErrors = {};
    if (!orderData.name || orderData.name.length > 50) {
      newErrors.name = "Tên là tối đa 50 ký tự";
    }
    if (
      !orderData.email ||
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(orderData.email)
    ) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!orderData.phone) {
      newErrors.phone = "Số điện thoại phải là 6 chữ số";
    }
    if (!orderData.address || orderData.address.length > 100) {
      newErrors.address = "Địa chỉ là tối đa 100 ký tự";
    }
    if (!orderData.city) {
      newErrors.city = "Vui lòng nhập tỉnh/thành";
    }
    if (!orderData.district) {
      newErrors.district = "Vui lòng nhập quận/huyện";
    }
    if (!orderData.ward) {
      newErrors.ward = "Vui lòng nhập phường/xã";
    }
    if (!orderData.paymentMethod) {
      newErrors.paymentMethod = "Vui lòng chọn phương thức thanh toán";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
  const [orderItemIds, setOrderItemIds] = useState([]);

  const handleInputChange = (e) => {
    setOrderData({
      ...orderData,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: "", // Clear error on user input
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
    // if (!validateFields()) {
    //   toast.error("Please correct the errors in the form before submitting.");
    //   return; // Stop further execution if validation fails
    // }
    navigate(`/payment?paymentMethod=${paymentMethod}`, { state: 
      { 
        totalCarePrice: totalCarePrice,  
        selectedProducts: selectedProducts,
        dates: dates,
        depositsArray: depositsArray
      } 
    });
    
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
      <Flex style={{ justifyContent: "space-between", width: "100%" }}>
      <Box className="checkOutInfo" style={{ padding: "20px", width: "65%" }}>
        <section className="TitleSection">
          <h3>Thông tin giao/nhận hàng</h3>
        </section>
        <Box>
          <Flex gap="large">
            <TextField
              id="name"
              name="name"
              label="Họ và tên"
              variant="outlined"
              value={name}
              onChange={handleInputChange}
              required
              inputProps={{ maxLength: 50 }}
              helperText={errors.name || "Tên tối đa 50 ký tự"}
              error={Boolean(errors.name)}
              style={{ width: "40%" }}
            />

            <TextField
              id="email"
              name="email"
              label="Email"
              variant="outlined"
              value={email}
              onChange={handleInputChange}
              required
              helperText={errors.email || "Vui lòng nhập email hợp lệ"}
              error={Boolean(errors.email)}
              style={{ width: "30%" }}
            />

            <TextField
              id="phone"
              name="phone"
              label="Số điện thoại"
              variant="outlined"
              value={phone}
              onChange={handleInputChange}
              required
              style={{ width: "25%" }}
            />
          </Flex>
        </Box>

        <Box style={{ marginTop: "2%" }}>
          <Flex gap="large">
            <TextField
              id="address"
              name="address"
              label="Địa chỉ"
              variant="outlined"
              value={address}
              onChange={handleInputChange}
              required
              inputProps={{ maxLength: 100 }}
              style={{ width: "98%" }}
            />
          </Flex>
        </Box>

        <Box style={{ marginTop: "2%" }}>
          <Flex gap="large">
            <TextField
              id="city"
              name="city"
              label="Nhập tỉnh/thành"
              variant="outlined"
              value={orderData.city}
              onChange={handleInputChange}
              required
              inputProps={{ maxLength: 50 }}
              style={{ width: "25%" }}
            />
            <TextField
              id="district"
              name="district"
              label="Nhập quận/huyện"
              variant="outlined"
              value={orderData.district}
              onChange={handleInputChange}
              required
              inputProps={{ maxLength: 50 }}
              style={{ width: "25%" }}
            />
            <TextField
              id="ward"
              name="ward"
              label="Nhập phường/xã"
              variant="outlined"
              value={orderData.ward}
              onChange={handleInputChange}
              required
              inputProps={{ maxLength: 50 }}
              style={{ width: "25%" }}
            />
          </Flex>
        </Box>
      </Box>
      <Box style={{ padding: "20px", width: "35%" }}> 
        <Flex justify="space-between" vertical>
          <div className="OrderSection">
            <section className="OrderTitleSection" style={{
              width:"75%"
            }}>
              <h3>Thông tin đơn hàng</h3>
            </section>
            <List>
              {paginatedItems.map((item, index) => (
                <div key={index} >
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
            <section className="TitleFlexSection" style={{
              width:"75%"
            }}>
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
        </Box>
        
      </Flex>
      <Box style={{
        padding:"50px"
      }}>
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
        </Box>
    </>
  );
}
