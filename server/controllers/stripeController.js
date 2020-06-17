const { getStripeCustomerId } = require("../lib/dbHelper");
const { createSubscription } = require("../lib/stripeHelper");

exports.createSubscription = async (req, res) => {
  //Check if user who sent the request is authenticated first(signed in)
  if (!req.isAuthUser) {
    console.log("Create subscription called but NOT AUTHENTICATED");

    res
      .status(403)
      .json({ message: "You are not authenticated. Please signin or signup." });

    return res.redirect("/signin");
  }

  //User is authenticated, get the stripe customer id of the user
  const customerId = await getStripeCustomerId(req.params.userId);
  const { paymentMethodId, priceId } = req.body;

  try {
    const subscription = await createSubscription(
      customerId,
      paymentMethodId,
      priceId
    );
    return res.send(subscription);
  } catch (error) {
    return res.status("402").send({ error: { message: error.message } });
  }
};
