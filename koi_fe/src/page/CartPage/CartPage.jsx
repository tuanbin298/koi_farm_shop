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
import { GET_ALL_FISH_CARE } from "../api/Queries/fishcare";
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
  });

  const { data: consignedFish, refetch: refetchConsigns } = useQuery(
    GET_ALL_FISH_CARE,
    {
      variables: { where: { user: { id: { equals: userId } } } },
    }
  );

  useEffect(() => {
    refetchItems();
  }, [refetchItems]);

  useEffect(() => {
    refetchConsigns();
  }, [refetchConsigns]);

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("selectedProducts"));
    if (storedProducts) setSelectedProducts(storedProducts);

    const storedDates = JSON.parse(localStorage.getItem("dates"));
    if (storedDates) setDates(storedDates);

    setTotalCarePrice(localStorage.getItem("totalCarePrice") || 0);
    const storedDepositsArray = JSON.parse(
      localStorage.getItem("depositsArray")
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

  const handleToCheckOut = () => {
    navigate("/checkout", {
      state: {
        totalCarePrice: totalCarePrice,
        selectedProducts: selectedProducts,
        dates: dates,
        depositsArray: depositsArray,
      },
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

  const renderItemsTable = (items, type) => {
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

    return (
      <TableContainer component={Paper} style={{ marginBottom: "20px" }}>
        <Table aria-label={`${type} table`}>
          <TableHead>
            <TableRow>
              <TableCell>Sản phẩm</TableCell>
              <TableCell>Tên</TableCell>
              {type === "Farm Koi" && (
                <TableCell align="center">Ký gửi nuôi</TableCell>
              )}
              <TableCell align="center">Thành tiền (VND)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedItems.map((cartItem) => (
              <TableRow key={cartItem.id}>
                <TableCell>
                  <Image
                    width={200}
                    src={
                      type === "Farm Koi"
                        ? cartItem.product[0]?.image?.publicUrl || ""
                        : cartItem.consignmentProduct[0]?.photo?.image
                            ?.publicUrl || ""
                    }
                  />
                </TableCell>
                <TableCell align="center">
                  {type === "Farm Koi"
                    ? cartItem.product[0]?.name
                    : cartItem.consignmentProduct[0]?.name}
                </TableCell>
                {type === "Farm Koi" && (
                  <TableCell align="center">
                    <Checkbox
                      checked={depositFields[cartItem.id] || false}
                      onChange={() => handleDepositToggle(cartItem.id)}
                    />
                    <p>Ký gửi nuôi</p>
                  </TableCell>
                )}
                <TableCell align="center">
                  {formatMoney(
                    type === "Farm Koi"
                      ? cartItem.product[0]?.price
                      : cartItem.consignmentProduct[0]?.price
                  )}
                  <Button
                    variant="contained"
                    color="error"
                    style={{ marginLeft: "15%" }}
                    onClick={() => handleDelete(cartItem.id)}
                    disabled={loading || isDeleting}
                  >
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
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

          {/* Display loading below the title */}
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
          ) : farmKoiItems.length === 0 && consignmentKoiItems.length === 0 ? (
            <Typography variant="h6" align="center" color="textSecondary">
              Giỏ hàng của bạn hiện đang trống.
            </Typography>
          ) : (
            <>
              {/* Conditionally render Farm Koi and Consignment Koi sections */}
              {farmKoiItems.length > 0 && (
                <>
                  <Typography variant="h6">Cá Koi Trang trại</Typography>
                  {renderItemsTable(farmKoiItems, "Farm Koi")}
                </>
              )}

              {consignmentKoiItems.length > 0 && (
                <>
                  <Typography variant="h6">Cá Koi Ký gửi</Typography>
                  {renderItemsTable(consignmentKoiItems, "Consignment Koi")}
                </>
              )}

              {/* Pagination */}
              <Box display="flex" justifyContent="center" marginTop={2}>
                <Pagination
                  count={Math.ceil(
                    (farmKoiItems.length + consignmentKoiItems.length) /
                      itemsPerPage
                  )}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>

              {/* Total Price Display */}
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

              {/* Checkout Button */}
              <Box display="flex" justifyContent="flex-end" marginTop={2}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleToCheckOut}
                >
                  Tiến hành thanh toán <FaShoppingCart />
                </Button>
              </Box>
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default CartPage;
