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
import { CREATE_ORDER, UPDATE_ORDER } from ".././api/Mutations/order";
import { CREATE_ORDER_ITEMS } from ".././api/Mutations/orderItem";
import { DELETE_CART_ITEM } from "../api/Mutations/deletecartItem";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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
  const { loading, error, data: cartItems, refetch: refetchItems } = useQuery(GET_CART_ITEMS, {
    variables: {
      where: {
        user: { id: { equals: userId } },
      },
    },
  });
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
  let totalPrice = 0;
  
  const handlePaymentMethodResult = async ({ paymentMethod, error }) => {
    if (error) {
      toast.error("Lỗi tạo đơn hàng!");
      console.error(error.message);
    } else {
      
      cartItems.cartItems?.forEach((cartItem) => {
        if (cartItem.product.length > 0) {
          totalPrice += cartItem.product[0].price;
        } else if (cartItem.consignmentProduct) {
          totalPrice += cartItem.consignmentProduct[0].price;
        }
      });
      try {
        // Create the order
        const { data: orderData } = await createOrder({
          variables: {
            data: {
              user: { connect: { id: userId } },
              price: totalPrice,
              address: `${localStorage.getItem("address")}`,
            },
          },
        });

        const orderId = orderData.createOrder.id;

        // Create order items
        const orderItems = cartItems.cartItems.map((item) => ({
          ...(item.product.length > 0
            ? { product: { connect: { id: item.product[0].id } } }
            : { consignmentSale: { connect: { id: item.consignmentProduct[0].id } } }),
          order: { connect: { id: orderId } },
          quantity: 1,
          price: item.product.length > 0 ? item.product[0].price : item.consignmentProduct[0].price,
        }));

        const { data: createOrderItemsData } = await createOrderItems({
          variables: { data: orderItems },
        });

        // Link order items to the order
        const orderItemIds = createOrderItemsData.createOrderItems.map((item) => item.id);
        for (let i = 0; i < orderItemIds.length; i++){
          // const orderItemId = orderItems[i].id;
          console.log(orderItemIds[i]);
          await updateOrder({
            variables: {
              where: {
                id: orderId
              },
              data: {
                items: {
                  connect: [
                    {
                      id: orderItemIds[i]
                    }
                  ]
                }
              }
            }
          })
        }

        // Delete items from the cart

        for (let i = 0; i < cartItems.cartItems.length; i++) {
          const cartItemId = cartItems.cartItems[i].id;
          await deleteCartItem({
            variables: {
              where: { id: cartItemId },
            },
          });
        }
        toast.success("Đã tạo đơn hàng!");
        navigate("/");
      } catch (error) {
        console.error("Error creating order:", error);
        toast.error("Lỗi tạo đơn hàng!");
      }
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <form onSubmit={handleSubmit}>
        <CardElement />
        <Button
          variant="contained"
          type="submit"
          disabled={!stripe || !elements}
        >
          Thanh toán
        </Button>
      </form>
    </>
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
