import { Container, Divider } from "@material-ui/core";
import {
  CardElement,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import axios from "axios";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

//test1 user cus_HT4gEtc9Zy8ndM
const createSubscription = async ({ userId, paymentMethodId, priceId }) => {
  console.log("Checkout Form - createSubscription");
  try {
    const result = await axios.post(
      `/api/stripe/${userId}/create-subscription`,
      {
        paymentMethodId,
        priceId,
      }
    );
    //console.log(data);//JSON object
    console.log(result);

    // If the card is declined, display an error to the user.
    if (result.error) {
      // The card had an error when trying to attach it to a customer.
      throw result;
    }

    // If attaching this card to a Customer object succeeds,
    // but attempts to charge the customer fail, you
    // get a requires_payment_method error.
    // .then(handleRequiresPaymentMethod)

    // No more actions required. Provision your service for the user.
    // .then(onSubscriptionComplete)
  } catch (error) {
    // An error has happened. Display the failure to the user here.
    // We utilize the HTML element we created.
    //showCardError(error);
    console.log(error);
  }
};

const CheckoutForm = ({ userId }) => {
  const elements = useElements();
  const stripe = useStripe();

  const createPaymentMethod = (cardElement, userId, priceId) => {
    return stripe
      .createPaymentMethod({
        type: "card",
        card: cardElement,
      })
      .then((result) => {
        if (result.error) {
          console.log(result.error);
        } else {
          createSubscription({
            userId: userId,
            paymentMethodId: result.paymentMethod.id,
            priceId: priceId,
          });
        }
      });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    createPaymentMethod(
      elements.getElement(CardElement),
      userId,
      "price_1Gu2n8AOCcUhE0MFLb8xXxIr"
    );
  };

  return (
    <Paper>
      <form onSubmit={handleSubmit}>
        <h3>Card Information</h3>
        <CardElement options={CARD_ELEMENT_OPTIONS} />
        <button type="submit" disabled={!stripe}>
          Pay
        </button>
      </form>

      {/* <CardNumberElement />
      <CardExpiryElement />
      <CardCvcElement />
      <Divider />
      <label>Name on Card</label>
      <TextField id="name-on-card" label="" variant="outlined" />
      <label>Postal Code</label>
      <TextField id="postal-code" label="" variant="outlined" /> */}
    </Paper>
  );
};

export default CheckoutForm;
