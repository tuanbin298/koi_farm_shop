import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  PaymentElement,
  Elements,
  useElements,
  useStripe,
  CardElement,
} from "@stripe/react-stripe-js";

const CheckoutForm = () => {
  return (
    <CheckoutFormStyles onSubmit={handleSubmit}>
      <CardElement />
      <Button variant="contained">Thanh toán</Button>
    </CheckoutFormStyles>
  );
};

function Payment() {
  return (
    <Elements stripe={stripe} options={options}>
      <CheckoutForm />
    </Elements>
  );
}

export default Payment;
