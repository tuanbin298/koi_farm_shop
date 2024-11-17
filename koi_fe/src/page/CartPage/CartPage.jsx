import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Box,
  Typography,
  Button,
  Pagination,
  CircularProgress,
} from "@mui/material";
import { FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Image } from "antd";
import { useQuery, useMutation } from "@apollo/client";
import { GET_CART_ITEMS } from "../api/Queries/cartItem";
import { DELETE_CART_ITEM } from "../api/Mutations/deletecartItem";
import { formatMoney } from "../../utils/formatMoney";
import "./CartPage.css";

const CartPage = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("id");
  const [depositFields, setDepositFields] = useState({});
  const [page, setPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const itemsPerPage = 3;
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [deleteCartItem] = useMutation(DELETE_CART_ITEM);
  const [dates, setDates] = useState({});
  const [totalCarePrice, setTotalCarePrice] = useState(0);
  const [depositsArray, setDepositsArray] = useState([]);
  const {
    loading,
    error,
    data,
    refetch: refetchItems,
  } = useQuery(GET_CART_ITEMS, {
    variables: { where: { user: { id: { equals: userId } } } },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (userId) {
      refetchItems(); // Fetch new user's cart items on user change
    }
  }, [userId, refetchItems]);

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem(`selectedProducts_${userId}`));
    if (storedProducts) setSelectedProducts(storedProducts);

    const storedDates = JSON.parse(localStorage.getItem(`dates_${userId}`));
    if (storedDates) setDates(storedDates);

    const storedTotalCarePrice = localStorage.getItem(`totalCarePrice_${userId}`);
    setTotalCarePrice(storedTotalCarePrice);

    const storedDepositsArray = JSON.parse(
      localStorage.getItem(`depositsArray_${userId}`)
    );
    if (storedDepositsArray) setDepositsArray(storedDepositsArray);
  }, []);

  const farmKoiItems =
    data?.cartItems?.filter((item) => item.product?.length > 0) || [];
  const consignmentKoiItems =
    data?.cartItems?.filter((item) => item.consignmentProduct?.length > 0) ||
    [];

  const farmTotal = farmKoiItems.reduce(
    (sum, item) => sum + (item.product[0]?.price || 0),
    0
  );
  const consignmentTotal = consignmentKoiItems.reduce(
    (sum, item) => sum + (item.consignmentProduct[0]?.price || 0),
    0
  );
  const totalPrice = farmTotal + consignmentTotal;

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedFarmItems = farmKoiItems.slice(startIndex, endIndex) || [];
  const paginatedConsignmentItems =
    consignmentKoiItems.slice(startIndex, endIndex) || [];

  const handleToCheckOut = () => {
    navigate("/checkout", {
      state: { totalCarePrice, selectedProducts, dates, depositsArray },
    });
  };

  const handleDelete = async (cartItemId) => {
    try {
      setIsDeleting(true);
      await deleteCartItem({ variables: { where: { id: cartItemId } } });
      refetchItems();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Delete failed: ", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDepositToggle = (productId) => {
    setDepositFields((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleProceedToFishCareService = () => {
    const selectedProducts =
      data?.cartItems?.filter((item) => depositFields[item.id]) || [];
    return (
      <Link to="/fishcareservice" state={{ selectedProducts }}>
        <Button variant="contained" color="primary">
          Tiếp tục Ký gửi
        </Button>
      </Link>
    );
  };

  const handleCheckedConsign = (cartItem) => {
    const selectedProductIds = selectedProducts.map((product) => product.id);
    return selectedProductIds.includes(cartItem.id);
  };

  return (
    <div className="cart-container">
      <Link to="/koiList">
        <section className="back-button-section">
          <div className="icon-container">
            <FaArrowLeft className="icon" />
          </div>
          <span className="back-button-text">
            Tiếp tục mua hàng / Quay lại trang chủ
          </span>
        </section>
      </Link>

      <main className="cart-content">
        <section>
          <h2>Giỏ hàng</h2>

          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mt={2}
            >
              <CircularProgress color="primary" />
              <Typography variant="h6" style={{ marginLeft: 10 }}>
                Đang tải giỏ hàng...
              </Typography>
            </Box>
          ) : error ? (
            <Typography variant="h6" align="center" color="error">
              Lỗi khi tải giỏ hàng!
            </Typography>
          ) : farmKoiItems.length === 0 && consignmentKoiItems.length === 0 ? (
            <Typography variant="h6" align="center" color="textSecondary">
              Giỏ hàng của bạn hiện đang trống.
            </Typography>
          ) : (
            <>
              {/* Conditionally display each section if items are present */}
              {farmKoiItems.length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Cá Koi Trang trại
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table aria-label="farm cart table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Sản phẩm</TableCell>
                          <TableCell></TableCell>
                          <TableCell align="center">Ký gửi nuôi</TableCell>
                          <TableCell align="center">Thành tiền (VND)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {farmKoiItems.map((cartItem) => (
                          <TableRow key={cartItem.id}>
                            <TableCell>
                              <Image
                                width={200}
                                src={
                                  cartItem.product[0]?.image?.publicUrl || ""
                                }
                              />
                            </TableCell>
                            <TableCell align="center">
                              {cartItem.product[0]?.name}
                            </TableCell>
                            <TableCell align="center">
                              <Checkbox
                                checked={
                                  cartItem.isStored ||
                                  depositFields[cartItem.id] ||
                                  false
                                }
                                disabled={cartItem.isStored}
                                onChange={() =>
                                  handleDepositToggle(cartItem.id)
                                }
                              />
                              <p>Ký gửi nuôi</p>
                            </TableCell>
                            <TableCell align="center">
                              {formatMoney(cartItem.product[0]?.price)}
                              <Button
                                variant="contained"
                                color="error"
                                style={{ marginLeft: "15%" }}
                                onClick={() => handleDelete(cartItem.id)}
                                // disabled={loading || isDeleting}
                              >
                                Xóa
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}

              {consignmentKoiItems.length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Cá Koi Ký gửi
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table aria-label="consignment cart table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Sản phẩm</TableCell>
                          <TableCell></TableCell>
                          <TableCell align="center">Thành tiền (VND)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {consignmentKoiItems.map((cartItem) => (
                          <TableRow key={cartItem.id}>
                            <TableCell>
                              <Image
                                width={200}
                                src={
                                  cartItem.consignmentProduct[0]?.photo?.image
                                    ?.publicUrl || ""
                                }
                              />
                            </TableCell>
                            <TableCell align="center">
                              {cartItem.consignmentProduct[0]?.name}
                            </TableCell>
                            <TableCell align="center">
                              {formatMoney(
                                cartItem.consignmentProduct[0]?.price
                              )}
                              <Button
                                variant="contained"
                                color="error"
                                style={{ marginLeft: "15%" }}
                                onClick={() => handleDelete(cartItem.id)}
                                // disabled={loading || isDeleting}
                              >
                                Xóa
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}

              <Box display="flex" justifyContent="center" marginTop={2}>
                {/* <Pagination
                  count={Math.ceil(
                    (farmKoiItems.length + consignmentKoiItems.length) /
                      itemsPerPage
                  )}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                /> */}
              </Box>

              <Box
                display="flex"
                flexDirection="column"
                alignItems="flex-end"
                padding={2}
              >
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Tổng tiền
                </Typography>
                <Typography variant="h5" color="textSecondary">
                  {formatMoney(totalPrice)}
                </Typography>
              </Box>

              {/* {(consignmentKoiItems.length > 0 ||
                paginatedConsignmentItems.length > 0) && (
                <Box display="flex" justifyContent="flex-end" marginTop={2}>
                  {Object.values(depositFields).some(
                    (isSelected) => isSelected
                  ) ? (
                    handleProceedToFishCareService()
                  ) : (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleToCheckOut}
                    >
                      Tiến hành thanh toán <FaShoppingCart />
                    </Button>
                  )}
                  <Button
                      variant="contained"
                      color="success"
                      onClick={handleToCheckOut}
                    >
                      Tiến hành thanh toán <FaShoppingCart />
                    </Button>
                </Box>
              )} */}
               <Box display="flex" justifyContent="flex-end" marginTop={2}>
                  {Object.values(depositFields).some(
                    (isSelected) => isSelected
                  ) ? (
                    handleProceedToFishCareService()
                  ) : (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleToCheckOut}
                    >
                      Tiến hành thanh toán <FaShoppingCart />
                    </Button>
                  )}
                </Box>
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default CartPage;
