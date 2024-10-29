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

// User information
const userId = localStorage.getItem("id");
const userName = localStorage.getItem("name");
const userEmail = localStorage.getItem("email");

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
      billing_details: {
        name: userName,
        email: userEmail,
      },
    });

    handlePaymentMethodResult(result);

    console.log("[PaymentMethod]", result);
  };

  const handlePaymentMethodResult = async ({ paymentMethod, error }) => {
    if (error) {
      console.error(error.message);
    } else {
      // Send paymentMethod.id to your server (see Step 3)
      // call api to create order based on cart info
      // return to success page
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <Button variant="contained" type="submit" disabled={!stripe || !elements}>
        Thanh toán
      </Button>
    </form>
  );
};

function Payment() {
  // Call API cart
  const {
    data: dataCart,
    loading: loadingCart,
    error: errorCart,
  } = useQuery(GET_CART_ITEMS, {
    variables: {
      where: {
        user: { id: { equals: userId } },
      },
    },
  });
  console.log(dataCart);

  // Calculate total price
  const [totalAmount, setTotalAmount] = useState(null);

  useEffect(() => {
    if (dataCart) {
      let total = dataCart.cartItems.reduce((sum, cartItem) => {
        // Kiểm tra sản phẩm trong `product` hoặc `consignmentProduct`
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
  console.log(totalAmount);

  const stripePromise = loadStripe(
    "pk_test_51PZy5CRwV3ieMSE0yi4gEMKnnM1gg4TArSRYf1WAjEmBvMz3MOWXZQOPqSxBbIortJdLmhZnDnmFnO1Njqfa7YUV00F4HhRF80"
  );

  const options = {
    mode: "payment",
    amount: totalAmount,
    currency: "vnd",
  };
  console.log(options);

  return (
    <>
      {totalAmount > 0 && options ? (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm />
        </Elements>
      ) : (
        <p>Total amount must be greater than 0 to proceed with payment.</p>
      )}
    </>
  );
}

export default Payment;
