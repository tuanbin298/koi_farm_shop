import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Select from "react-select";
import "./Checkout.css";
import { Button, Flex, Radio, Space, Image } from "antd";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_CART_ITEMS } from "../api/Queries/cartItem";
import toast, { Toaster } from "react-hot-toast";
import { formatMoney } from "../../utils/formatMoney";
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  ListItemAvatar,
  Grid,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem("id");

  // Fetch cart items from GraphQL API
  const { data: cartItems, loading: loadingCart } = useQuery(GET_CART_ITEMS, {
    variables: {
      where: { user: { id: { equals: userId } } },
    },
  });

  // Display a loading state if data is still being fetched
  if (loadingCart) {
    return <p>Loading cart items...</p>;
  }

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [dates, setDates] = useState({});
  const [totalCarePrice, setTotalCarePrice] = useState(0);
  const [depositsArray, setDepositsArray] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [errors, setErrors] = useState({});

  const [provinceOptions, setProvinceOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [wardOptions, setWardOptions] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  // Pagination configuration
  const [page, setPage] = useState(1);
  const itemsPerPage = 3;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Define paginatedItems with fallback in case cartItems is not loaded
  const paginatedItems =
    cartItems?.cartItems?.slice(startIndex, endIndex) || [];

  // Fetch initial province data and handle passed location state
  useEffect(() => {
    axios.get("https://provinces.open-api.vn/api/?depth=1").then((response) => {
      const provinces = response.data.map((prov) => ({
        value: prov.code,
        label: prov.name,
      }));
      setProvinceOptions(provinces);
    });

    if (location.state && location.state.selectedProducts) {
      setSelectedProducts(location.state.selectedProducts);
      setDates(location.state.dates);
      setTotalCarePrice(location.state.totalCarePrice);
      setDepositsArray(location.state.depositsArray);
    }
  }, [location.state]);

  const [orderData, setOrderData] = useState({
    name: localStorage.getItem("name") || "",
    email: localStorage.getItem("email") || "",
    phone: localStorage.getItem("phone") || "",
    address: localStorage.getItem("address") || "",
    city: "",
    district: "",
    ward: "",
    paymentMethod: "",
  });

  // (Rest of your code remains the same)

  const handleProvinceChange = (selectedOption) => {
    setSelectedProvince(selectedOption);
    setSelectedDistrict(null); // Reset district and ward selections
    setSelectedWard(null);
    setDistrictOptions([]);
    setWardOptions([]);
    setOrderData({
      ...orderData,
      city: selectedOption.label,
      district: "",
      ward: "",
    });

    axios
      .get(
        `https://provinces.open-api.vn/api/p/${selectedOption.value}?depth=2`
      )
      .then((response) => {
        const districts = response.data.districts.map((dist) => ({
          value: dist.code,
          label: dist.name,
        }));
        setDistrictOptions(districts);
      });
  };

  const handleDistrictChange = (selectedOption) => {
    setSelectedDistrict(selectedOption);
    setSelectedWard(null);
    setWardOptions([]);
    setOrderData({ ...orderData, district: selectedOption.label, ward: "" });

    axios
      .get(
        `https://provinces.open-api.vn/api/d/${selectedOption.value}?depth=2`
      )
      .then((response) => {
        const wards = response.data.wards.map((ward) => ({
          value: ward.code,
          label: ward.name,
        }));
        setWardOptions(wards);
      });
  };

  const handleWardChange = (selectedOption) => {
    setSelectedWard(selectedOption);
    setOrderData({ ...orderData, ward: selectedOption.label });
  };

  const checkoutOptions = [
    { label: "Thanh toán hết", value: "all" },
    { label: "Thanh toán khi nhận hàng (đặt cọc 50%)", value: "cod" },
  ];

  const handleInputChange = (e) => {
    setOrderData({
      ...orderData,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const validateFields = () => {
    const newErrors = {};
    if (!orderData.name || orderData.name.length > 50) {
      newErrors.name = "Tên là tối đa 50 ký tự";
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
    if (!paymentMethod) {
      newErrors.paymentMethod = "Vui lòng chọn phương thức thanh toán";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateOrder = () => {
    if (!validateFields()) {
      toast.error("Vui lòng hoàn thành các trường thông tin");
      return;
    }

    navigate(`/payment?paymentMethod=${paymentMethod}`, {
      state: {
        totalCarePrice,
        selectedProducts,
        dates,
        depositsArray,
        paymentMethod,
        orderData,
      },
    });
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Flex style={{ justifyContent: "space-between", width: "100%" }}>
        <Box sx={{ padding: 4 }}>
          <Typography variant="h6" gutterBottom>
            Thông tin giao/nhận hàng
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Họ và tên"
                variant="outlined"
                value={orderData.name}
                onChange={handleInputChange}
                required
                error={Boolean(errors.name)}
                helperText={errors.name || "Tên tối đa 50 ký tự"}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                variant="outlined"
                value={orderData.email}
                onChange={handleInputChange}
                required
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="phone"
                name="phone"
                label="Số điện thoại"
                variant="outlined"
                value={orderData.phone}
                onChange={handleInputChange}
                required
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="address"
                name="address"
                label="Địa chỉ"
                variant="outlined"
                value={orderData.address}
                onChange={handleInputChange}
                required
                error={Boolean(errors.address)}
                helperText={errors.address || "Địa chỉ tối đa 100 ký tự"}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Select
                placeholder="Chọn tỉnh/thành"
                options={provinceOptions}
                onChange={handleProvinceChange}
                isClearable
                value={selectedProvince}
              />
              {errors.city && (
                <Typography color="error" variant="body2">
                  {errors.city}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              <Select
                placeholder="Chọn quận/huyện"
                options={districtOptions}
                onChange={handleDistrictChange}
                isClearable
                value={selectedDistrict}
                isDisabled={!districtOptions.length}
              />
              {errors.district && (
                <Typography color="error" variant="body2">
                  {errors.district}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              <Select
                placeholder="Chọn phường/xã"
                options={wardOptions}
                onChange={handleWardChange}
                isClearable
                value={selectedWard}
                isDisabled={!wardOptions.length}
              />
              {errors.ward && (
                <Typography color="error" variant="body2">
                  {errors.ward}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>

        <Box style={{ padding: "20px", width: "35%" }}>
          <Flex justify="space-between" vertical>
            <div className="OrderSection">
              <section className="OrderTitleSection" style={{ width: "75%" }}>
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
                            item.consignmentProduct[0]?.photo?.image
                              ?.publicUrl ||
                            ""
                          }
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          item.product[0]?.name ||
                          item.consignmentProduct[0]?.name
                        }
                        secondary={`Giá: ${formatMoney(
                          item.product[0]?.price ||
                            item.consignmentProduct[0]?.price
                        )}`}
                      />
                    </ListItem>
                    <Divider />
                  </div>
                ))}
                {cartItems?.cartItems?.length === 0 && (
                  <Typography variant="body2">Giỏ hàng trống</Typography>
                )}
              </List>
            </div>
            <div className="checkoutSection">
              <section className="TitleFlexSection" style={{ width: "75%" }}>
                <h3>Phương thức thanh toán</h3>
              </section>

              <Flex direction="column" gap="middle">
                <Box sx={{ width: "100%" }}>
                  <Radio.Group
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                      setOrderData({
                        ...orderData,
                        paymentMethod: e.target.value,
                      });
                      setErrors({ ...errors, paymentMethod: "" }); // Clear error on selection
                    }}
                    value={paymentMethod}
                    required
                  >
                    <Space direction="vertical">
                      {checkoutOptions.map((option) => (
                        <Radio key={option.value} value={option.value}>
                          {option.label}
                        </Radio>
                      ))}
                    </Space>
                  </Radio.Group>

                  {/* Display error message directly below Radio.Group */}
                  {errors.paymentMethod && (
                    <Typography
                      color="error"
                      variant="body2"
                      sx={{ marginTop: 1, marginLeft: 2 }}
                    >
                      {errors.paymentMethod}
                    </Typography>
                  )}
                </Box>
              </Flex>
            </div>
          </Flex>
        </Box>
      </Flex>

      <Box style={{ padding: "50px" }}>
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
