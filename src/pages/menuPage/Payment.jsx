import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckOutForm from "./CheckOutForm";
import useCart from "../../hooks/useCart";

const stripePromise = loadStripe(import.meta.env.VITE_Stripe_PK);

function payment() {
  const [cart] = useCart();

  const calculateTotalPrice = (item) => {
    return item.price * item.quantity;
  };

  const cartSubtotal = Array.isArray(cart)
    ? cart.reduce((total, item) => {
        return total + calculateTotalPrice(item);
      }, 0)
    : 0;

  const orderTotal = cartSubtotal;

  return (
    <div className="max-w-screen-2x1 container mx-auto x1:px-24 px-4 py-28">
      <Elements stripe={stripePromise}>
        <CheckOutForm price={orderTotal} cart={cart} />
      </Elements>
    </div>
  );
}

export default payment;
