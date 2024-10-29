import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useElements,
  useStripe,
  CardElement,
} from "@stripe/react-stripe-js";
import Button from "@mui/material/Button";
import { useQuery } from "@apollo/client";
import { GET_CART_ITEMS } from "../api/Queries/cartItem";
import { GET_FISH_CARE } from "../api/Queries/fishCare";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { formatMoney } from "../../utils/formatMoney";
import { FaArrowLeft } from "react-icons/fa";
import "./payment.css";

// User information
const userId = localStorage.getItem("id");
const userName = localStorage.getItem("name");
const userEmail = localStorage.getItem("email");

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const result = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
      billing_details: {
        name: userName,
        email: userEmail,
      },
    });

    handlePaymentMethodResult(result);
  };

  const handlePaymentMethodResult = async ({ paymentMethod, error }) => {
    if (error) {
      toast.error("Error creating order!");
      console.error(error.message);
    } else {
      navigate("/");
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
                "::placeholder": {
                  color: "#6c757d",
                },
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
          Pay Now
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
  const navigate = useNavigate();

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

  const stripePromise = loadStripe("your-publishable-key");

  return (
    <section className="container mt-5">
      <section className="back-button-section">
        <div className="icon-container">
          <FaArrowLeft className="icon" />
        </div>
        <span className="back-button-text">
          <Link to="/checkout">Quay lại trang điền thông tin</Link>
        </span>
      </section>

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

                  return (
                    <tr key={item.id}>
                      <td>{product.name}</td>
                      <td>{formatMoney(price)}</td>
                      <td>
                        {consignmentFee > 0 ? formatMoney(consignmentFee) : "-"}
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
