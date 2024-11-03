import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useElements,
  useStripe,
  CardElement,
} from "@stripe/react-stripe-js";
import Button from "@mui/material/Button";
import { useQuery, useMutation } from "@apollo/client";
import { GET_CART_ITEMS } from "../api/Queries/cartItem";
import { GET_FISH_CARE } from "../api/Queries/fishcare";
import { CREATE_ORDER, UPDATE_ORDER } from ".././api/Mutations/order";
import {
  CREATE_ORDER_ITEMS,
  UPDATE_ORDER_ITEM,
} from ".././api/Mutations/orderItem";
import { DELETE_CART_ITEM } from "../api/Mutations/deletecartItem";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { formatMoney } from "../../utils/formatMoney";
import { FaArrowLeft } from "react-icons/fa";
import { CREATE_CONSIGNMENT_RAISING } from "../api/Mutations/fishcare";
import {
  UPDATE_PRODUCT_STATUS,
  UPDATE_CONSIGNMENT_PRODUCT_STATUS,
} from "../api/Mutations/updateproduct";
import "./payment.css";

// User information
const userId = localStorage.getItem("id");
const userName = localStorage.getItem("name");
const userEmail = localStorage.getItem("email");

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [createOrder] = useMutation(CREATE_ORDER);
  const [createOrderItems] = useMutation(CREATE_ORDER_ITEMS);
  const [updateOrder] = useMutation(UPDATE_ORDER);
  const [deleteCartItem] = useMutation(DELETE_CART_ITEM);
  const [updateProductStatus] = useMutation(UPDATE_PRODUCT_STATUS);
  const [updateConsignmentProductStatus] = useMutation(
    UPDATE_CONSIGNMENT_PRODUCT_STATUS
  );
  const today = new Date().toISOString().split("T")[0];
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [dates, setDates] = useState({});
  const location = useLocation();
  const [totalCarePrice, setTotalCarePrice] = useState(0);
  const [createConsignmentRaisings] = useMutation(CREATE_CONSIGNMENT_RAISING);
  const [depositsArray, setDepositsArray] = useState([]);
  // const [updateOrderItem] = useMutation(UPDATE_ORDER_ITEM)
  let consignmentRaisingIds = [];
  useEffect(() => {
    if (location.state && location.state.selectedProducts) {
      setSelectedProducts(location.state.selectedProducts);
      setDates(location.state.dates);
      setTotalCarePrice(location.state.totalCarePrice);
      setDepositsArray(location.state.depositsArray);
    }
  }, [location.state]);

  const orderAddress =
    location.state.orderData.address +
    "," +
    location.state.orderData.city +
    "," +
    location.state.orderData.district +
    "," +
    location.state.orderData.ward;

  const checkConsigned = (cartItem) => {
    const selectedProductIds = selectedProducts.map((product) => product.id);
    return selectedProductIds.includes(cartItem.id);
  };

  const {
    loading,
    error,
    data: cartItems,
  } = useQuery(GET_CART_ITEMS, {
    variables: {
      where: {
        user: { id: { equals: userId } },
      },
    },
  });
  useEffect(() => {
    refetchItems();
  }, [refetchItems]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const result = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
      billing_details: { name: userName, email: userEmail },
    });

    handlePaymentMethodResult(result);
    console.log("[PaymentMethod]", result);
  };

  const handlePaymentMethodResult = async ({ paymentMethod, error }) => {
    if (error) {
      console.error(error.message);
      return;
    }

    let totalPrice = 0;
    cartItems.cartItems?.forEach((cartItem) => {
      totalPrice +=
        cartItem.product.length > 0
          ? cartItem.product[0].price
          : cartItem.consignmentProduct[0].price;
    });

    try {
      const { data: orderData } = await createOrder({
        variables: {
          data: {
            user: { connect: { id: userId } },
            price: totalPrice,
            address: orderAddress,
            paymentMethod: location.state.paymentMethod,
          },
        },
      });

      const orderId = orderData.createOrder.id;

      const orderItems = cartItems.cartItems.map((item) => ({
        ...(item.product.length > 0
          ? { product: { connect: { id: item.product[0].id } } }
          : {
              consignmentSale: {
                connect: { id: item.consignmentProduct[0].id },
              },
            }),
        order: { connect: { id: orderId } },
        price:
          item.product.length > 0
            ? item.product[0].price
            : item.consignmentProduct[0].price,
        isStored: checkConsigned(item),
      }));

      if (selectedProducts.length !== 0) {
        const consignmentData = selectedProducts.map((product) => {
          const { startDate, endDate } = dates[product.id] || {};
          const days =
            startDate && endDate
              ? Math.ceil(
                  (new Date(endDate) - new Date(startDate)) /
                    (1000 * 60 * 60 * 24)
                )
              : 0;

          return {
            user: { connect: { id: userId } },
            product: { connect: { id: product.product[0].id } },
            returnDate: new Date(endDate).toISOString(),
            consignmentPrice: days * 50000,
            status: "Đang xử lý",
            description: "Consignment for fish care",
          };
        });

        await createConsignmentRaisings({
          variables: { data: consignmentData },
        });
      }

      const { data: createOrderItemsData } = await createOrderItems({
        variables: { data: orderItems },
      });

        // Link order items to the order
        const orderItemIds = createOrderItemsData.createOrderItems.map(
          (item) => item.id
        );
        for (let i = 0; i < orderItemIds.length; i++) {
          // const orderItemId = orderItems[i].id;
          console.log(orderItemIds[i]);
          await updateOrder({
            variables: {
              where: {
                id: orderId,
              },
            });
          } else if (consignmentProductId) {
            console.log(
              "Updating consignment product status for product:",
              consignmentProductId
            );
            await updateConsignmentProductStatus({
              variables: {
                where: { id: consignmentProductId },
                data: { status: "Không có sẵn" },
              },
            });
          }
        } catch (error) {
          console.error("Error updating status:", error);
        }
      }

      for (let i = 0; i < cartItems.cartItems.length; i++) {
        const cartItemId = cartItems.cartItems[i].id;
        await deleteCartItem({
          variables: { where: { id: cartItemId } },
        });
      }

      toast.success("Đã tạo đơn hàng!");
      navigate("/someSuccessPage", { state: { from: "/payment" } });
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Lỗi tạo đơn hàng!");
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm">
        <label htmlFor="card-element" className="form-label">
          Card Information
        </label>
        <CardElement
          id="card-element"
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#495057",
                "::placeholder": { color: "#6c757d" },
              },
            },
          }}
          className="form-control mb-3"
        />
        <Button
          variant="contained"
          type="submit"
          disabled={!stripe || !elements}
          className="w-100"
        >
          Thanh Toán
        </Button>
      </form>
    </>
  );
};

function Payment() {
  const { data: dataCart } = useQuery(GET_CART_ITEMS, {
    variables: { where: { user: { id: { equals: userId } } } },
  });

  // Fetch consignment care data
  const { data: dataFishCare } = useQuery(GET_FISH_CARE, {
    variables: { where: { user: { id: { equals: userId } } } },
  });

  const [totalAmount, setTotalAmount] = useState(null);
  const [depositsArray, setDepositsArray] = useState([]);
  const location = useLocation();
  useEffect(() => {
    if (dataCart) {
      let total = dataCart.cartItems.reduce((sum, cartItem) => {
        if (cartItem.product.length > 0) {
          return sum + cartItem.product[0].price;
        } else if (cartItem.consignmentProduct.length > 0) {
          return sum + cartItem.consignmentProduct[0].price;
        }
        return sum;
      }, 0);

      const searchParams = new URLSearchParams(window.location.search);
      const paymentMethod = searchParams.get("paymentMethod");

      if (paymentMethod === "cod") {
        total = total / 2;
      }

      setTotalAmount(total > 0 ? total : 0);
    }
  }, [dataCart]);
  useEffect(() => {
    if (location.state && location.state.depositsArray) {
      setDepositsArray(location.state.depositsArray);
    }
  }, [location.state]);
  console.log(totalAmount);

  const stripePromise = loadStripe(
    "pk_test_51PZy5CRwV3ieMSE0yi4gEMKnnM1gg4TArSRYf1WAjEmBvMz3MOWXZQOPqSxBbIortJdLmhZnDnmFnO1Njqfa7YUV00F4HhRF80"
  );

  const options = {
    mode: "payment",
    amount: totalAmount,
    currency: "USD",
  };
  console.log(options);

  return (
    <section className="container mt-5">
      <Link to="/checkout">
        <section className="back-button-section">
          <div className="icon-container">
            <FaArrowLeft className="icon" />
          </div>
          <span className="back-button-text">
            Quay lại trang điền thông tin
          </span>
        </section>
      </Link>
      <section className="row">
        {/* Order Summary Section */}
        <article className="col-md-6">
          <section className="p-4 border rounded shadow-sm">
            <h3>Tóm tắt đơn hàng</h3>
            <table className="table no-borders">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Giá</th>
                  <th>Chi phí ký gửi</th>
                </tr>
              </thead>
              <tbody>
                {dataCart?.cartItems.map((item) => {
                  const product =
                    item.product.length > 0
                      ? item.product[0]
                      : item.consignmentProduct[0];
                  const price = product.price;

                  // Find consignment care fee for the product, if it exists
                  const consignmentItem = dataFishCare?.consigmentRaising.find(
                    (careItem) => careItem.product.id === product.id
                  );

                  const consignmentFee = consignmentItem
                    ? consignmentItem.ConsignmentPrice
                    : 0;

                  // Find the deposit amount from depositsArray based on cartItem.id
                  const depositEntry = depositsArray.find(
                    (deposit) => deposit.cartId === item.id
                  );
                  const depositAmount = depositEntry
                    ? depositEntry.totalDeposit
                    : 0;
                  console.log(depositEntry);
                  return (
                    <tr key={item.id}>
                      <td>{product.name}</td>
                      <td>{formatMoney(price)}</td>
                      <td>
                        {depositAmount > 0 ? formatMoney(depositAmount) : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <h5 className="mt-3">
              <strong>Tổng cộng:</strong> {formatMoney(totalAmount)}
            </h5>
          </section>
        </article>

        {/* Payment Details Section */}
        <aside className="col-md-6">
          <section className="p-4 border rounded shadow-sm">
            <h3>Chi tiết thanh toán</h3>
            {totalAmount > 0 ? (
              <Elements stripe={stripePromise}>
                <CheckoutForm />
              </Elements>
            ) : (
              <p>Tổng số tiền phải lớn hơn 0 để tiến hành thanh toán.</p>
            )}
          </section>
        </aside>
      </section>
    </section>
  );
}

export default Payment;
