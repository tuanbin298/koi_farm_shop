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
  Tabs,
  Tab,
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
  const [tab, setTab] = useState(0); // Current tab
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
  console.log(data);

  const { data: consignedFish, refetch: refetchConsigns } = useQuery(
    GET_ALL_FISH_CARE,
    {
      variables: {
        where: {
          user: {
            id: {
              equals: userId,
            },
          },
        },
      },
    }
  );
  console.log(consignedFish);

  const consignedIds = consignedFish?.consigmentRaisings
    ? consignedFish.consigmentRaisings.map((item) => item.product.id)
    : [];

  const consignedFishIds = consignedFish?.consigmentRaisings
    ? consignedFish.consigmentRaisings.map((item) => item.id)
    : [];

  console.log(consignedIds);
  console.log(consignedFishIds);
  useEffect(() => {
    refetchItems();
  }, [refetchItems]);
  useEffect(() => {
    refetchConsigns();
  }, [refetchConsigns]);
  useEffect(() => {
    // Retrieve and parse selectedProducts from localStorage
    const storedProducts = JSON.parse(localStorage.getItem("selectedProducts"));
    if (storedProducts) {
      setSelectedProducts(storedProducts);
    }

    const storedDates = JSON.parse(localStorage.getItem("dates"));
    if (storedDates) {
      setDates(storedDates);
    }

    const storedTotalCarePrice = localStorage.getItem("totalCarePrice");
    setTotalCarePrice(storedTotalCarePrice);

    const storedDepositsArray = JSON.parse(
      localStorage.getItem("depositsArray")
    );
    if (storedDepositsArray) {
      setDepositsArray(storedDepositsArray);
    }
  }, []);
  console.log(selectedProducts);
  console.log(dates);
  console.log(totalCarePrice);
  console.log(depositsArray);

  // Separate cart items into "Farm Koi" and "Consignment Koi"
  const farmKoiItems =
    data?.cartItems?.filter((item) => item.product?.length > 0) || [];
  const consignmentKoiItems =
    data?.cartItems?.filter((item) => item.consignmentProduct?.length > 0) ||
    [];

    {/*Count total of products from koi farm, consignment sales farm and total farm*/}
    const farmTotal = farmKoiItems.reduce((sum, item) => {
      return sum + (item.product[0]?.price || 0);
    }, 0);

    const consignmentTotal = consignmentKoiItems.reduce((sum, item) => {
      return sum + (item.consignmentProduct[0]?.price || 0);
    }, 0);
    console.log(farmTotal)
    console.log(consignmentTotal)

    const totalPrice = farmTotal + consignmentTotal
    
  // Map through cart items and consignment raisings to find consigned products

  // Determine current items based on the selected tab
  const currentItems = tab === 0 ? farmKoiItems : consignmentKoiItems;

  // Calculate total price for the current tab's items
  // const totalPrice = currentItems.reduce((sum, cartItem) => {
  //   const price =
  //     cartItem.product.length > 0
  //       ? cartItem.product[0].price
  //       : cartItem.consignmentProduct[0].price;
  //   return sum + price;
  // }, 0);

  const consignedCartItemIds = [];
  if (data?.cartItems && consignedFish?.consigmentRaisings) {
    data.cartItems.forEach((cartItem) => {
      const productId = cartItem.product?.[0]?.id; // Check if product exists and has an id
      const isConsigned = consignedFish.consigmentRaisings.some(
        (consignedItem) => consignedItem.product?.id === productId // Check if consigned item has product id
      );

      if (isConsigned && productId) {
        consignedCartItemIds.push(cartItem.id);
      }
    });
  }
  // Check if a specific cart item is consigned based on its unique cart item ID
  const handleCheckedConsign = (cartItem) => {
    // Extract IDs from selectedProducts
    const selectedProductIds = selectedProducts.map((product) => product.id);

    // Check if cartItem.id is in selectedProductIds
    return selectedProductIds.includes(cartItem.id);
  };
  {
    /* handle to checkout with consigned products */
  }
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

  // Handle delete cart item
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

  // Toggle deposit selection
  const handleDepositToggle = (productId) => {
    setDepositFields((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  // Handle pagination page change
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Pagination logic
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = currentItems.slice(startIndex, endIndex) || [];

  if (loading) return <p>Đang tải giỏ hàng...</p>;
  if (error) return <p>Lỗi khi tải giỏ hàng!</p>;

  // Handle tab change
  const handleTabChange = (event, newTab) => {
    setTab(newTab);
    setPage(1); // Reset to first page on tab change
  };

  // Handle proceed to fish care service
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

          {/* Tabs for Farm Koi and Consignment Koi */}
          <Tabs value={tab} onChange={handleTabChange} centered>
            <Tab label="Cá Koi Trang trại" />
            <Tab label="Cá Koi Ký gửi" />
          </Tabs>

          <TableContainer component={Paper}>
            <Table aria-label="cart table">
              <TableHead>
                <TableRow>
                  <TableCell>Sản phẩm</TableCell>
                  <TableCell></TableCell>
                  {tab === 0 && (
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
                          cartItem.product.length > 0
                            ? cartItem.product[0].image?.publicUrl || ""
                            : cartItem.consignmentProduct[0]?.photo?.image
                                ?.publicUrl || ""
                        }
                      />
                    </TableCell>
                    <TableCell align="center">
                      {cartItem.product.length > 0
                        ? cartItem.product[0]?.name
                        : cartItem.consignmentProduct[0]?.name}
                    </TableCell>
                    {tab === 0 && (
                      <TableCell align="center">
                        <Checkbox
                          checked={
                            cartItem.isStored ||
                            depositFields[cartItem.id] ||
                            false
                          }
                          disabled={cartItem.isStored}
                          onChange={() => handleDepositToggle(cartItem.id)}
                        />
                        <p>Ký gửi nuôi</p>
                      </TableCell>
                    )}
                    <TableCell align="center">
                      {formatMoney(
                        cartItem.product.length > 0
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

          {/* Pagination Controls */}
          <Box display="flex" justifyContent="center" marginTop={2}>
            <Pagination
              count={Math.ceil(currentItems.length / itemsPerPage)}
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

          {/* Proceed to Checkout or Fish Care Service */}
          {paginatedItems.length > 0 && (
            <Box display="flex" justifyContent="flex-end" marginTop={2}>
              {tab === 0 &&
              Object.values(depositFields).some((isSelected) => isSelected) ? (
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
          )}
        </section>
      </main>
    </div>
  );
};

export default CartPage;
