import CardPaymentForm from "./CardPaymentForm";
import { STRIPE_PUBLIC_KEY } from "./subscriptionHelper";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

export default (props) => {
  return (
    <Elements stripe={stripePromise}>
      <CardPaymentForm {...props} />
    </Elements>
  );
};
