import axios from "axios";

//test1 user cus_HT4gEtc9Zy8ndM
export const createSubscription = async ({
  userId,
  paymentMethodId,
  priceId,
}) => {
  try {
    const result = await axios.post(
      `/api/stripe/${userId}/create-subscription`,
      {
        paymentMethodId,
        priceId,
      }
    );

    // If the card is declined, display an error to the user.
    if (result.error) {
      // The card had an error when trying to attach it to a customer.
      throw result;
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const retryInvoiceWithNewPaymentMethod = async ({
  userId,
  paymentMethodId,
  invoiceId,
}) => {
  try {
    const result = await axios.post(`/api/stripe/${userId}/retry-invoice`, {
      paymentMethodId,
      invoiceId,
    });

    // If the card is declined, display an error to the user.
    if (result.error) {
      // The card had an error when trying to attach it to a customer.
      throw result;
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const updateSubscription = async (userId, priceId, data) => {
  console.log("BROWSER SIDE updateSubscription");
  console.log(data);

  try {
    const result = await axios.post(
      `/api/stripe/${userId}/update-subscription`,
      {
        priceId,
        data,
      }
    );

    return result;
  } catch (error) {
    throw error;
  }
};
