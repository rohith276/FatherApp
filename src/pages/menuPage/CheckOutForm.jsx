import React, { useEffect, useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { FaPaypal } from "react-icons/fa";
import useAxiosSecure from "./../../hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function CheckOutForm({ price, cart }) {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [cardError, setCardError] = useState("");
  const [clientSecret, setClintSecret] = useState("");

  useEffect(() => {
    if (typeof price !== "number" || price < 1) {
      return;
    }
    axiosSecure.post("/create-payment-intent", { price }).then((res) => {
      setClintSecret(res.data.clientSecret);
    });
  }, [price, axiosSecure]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);

    if (card == null) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
     // console.log("[error]", error);
      setCardError(error.message);
    } else {
      setCardError("Success!");
      //console.log("[PaymentMethod]", paymentMethod);
    }

    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: user?.displayName || "anonymous",
            email: user?.email || "unknown",
          },
        },
      });

    if (paymentIntent.status === "succeeded") {
      setCardError(`Your TransactionId : ${paymentIntent.id}`);

      const paymentsInfo = {
        email: user.email,
        transactionId: paymentIntent.id,
        price,
        quantity: cart.length,
        status: "success",
        itemName: cart.map((item) => item.name),
        cartItems: cart.map((item) => item._id),
        menuitem: cart.map((item) => item.menuItemId),
      };
      axiosSecure.post("/payments", paymentsInfo).then((res) => {
        alert("Payment successful!");
        navigate("/order");
      });
    }
  };

  const handleCashOnDelivery = async () => {
    const paymentsInfo = {
      email: user.email,
      transactionId: "COD", // Transaction ID for Cash on Delivery
      price,
      quantity: cart.length,
      status: "Cash on delivery", // Status for Cash on Delivery
      itemName: cart.map((item) => item.name),
      cartItems: cart.map((item) => item._id),
      menuitem: cart.map((item) => item.menuItemId),
    };
    axiosSecure.post("/payments", paymentsInfo).then((res) => {
      alert("Order placed successfully!");
      navigate("/order");
    });
  };

  return (
    <div className="flex flex-col sm:flex-row justify-start items-start gap-8">
      {/* left side */}
      <div className="md:w-1/2 w-full space-y-3">
        <h4 className="text-lg font-semibold">Order Summary</h4>
        <p>Total price: ${price}</p>
        <p>Number of Items: {cart.length}</p>
      </div>
      {/* right side */}
      <div className="md:w-1/2 w-full space-y-6 card shrink-0 max-w-sm shadow-2x1 bg-base-100 px-4 py-8">
        <h4 className="text-lg font-semibold">Process Your Payment</h4>
        <h5 className="font-medium">Credit/Debit Card</h5>

        {/* Stripe element */}
        <form onSubmit={handleSubmit}>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
          <button
            type="submit"
            disabled={!stripe}
            className="btn btn-sm mt-5 bg-primary-500 w-full text-white"
          >
            Pay
          </button>
        </form>

        {cardError && <p className="text-red italic text-xs">{cardError}</p>}

        {/* PayPal */}
        <div className="mt-5 text-center">
          <hr />
          <button
            type="submit"
            className="btn btn-sm mt-5 bg-orange-500 text-white"
            onClick={() => handlePayPalPayment()}
          >
            <FaPaypal /> Pay with PayPal
          </button>
        </div>
         {/* Cash on Delivery */}
         <div className="mt-5 text-center">
         <hr />
         <button
           type="button"
           onClick={handleCashOnDelivery}
           className="btn btn-sm mt-5 bg-green-500 text-white"
         >
           Cash on Delivery
         </button>
       </div>
      </div>
    </div>
  );
}

export default CheckOutForm;
