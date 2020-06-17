import { Container } from "@material-ui/core";
import axios from "axios";

import React from "react";
import ReactDOM from "react-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  "pk_test_51GtbV6AOCcUhE0MFvAWMLeKwzSng9HKU4TVeTAyLo9yTdB0NNPDRDINgrMlW2NmxJe5Y4vzGITvmcavcElXpEpXD00tsidmwlf"
);

export default function DashboardPane(props) {
  const handleTESTClick = async () => {
    const url = "/api/stripe/" + props.auth.user.id + "/create-customer";
    const customer = {
      billingEmail: "asd@asd.com",
    };

    const { data } = await axios.post(url, customer);
    console.log(data);
  };

  return (
    <Container>
      <h1>{props.message}</h1>
      <button onClick={handleTESTClick}>TEST</button>
      <Elements stripe={stripePromise}>
        <CheckoutForm userId={props.auth.user.id} />
      </Elements>
    </Container>
  );
}
