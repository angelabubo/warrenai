const dbConnection = require("./dbConnection");
const {
  createStripeCustomer,
  getDefaultPaymentMethodDetails,
  retrieveCharge,
  retrieveSubscription,
} = require("./stripeHelper");

const { getProductById } = require("../data/products");
//Hashing + Salting Passwords
const bcrypt = require("bcryptjs");
const saltRounds = 10;

//Users
exports.getUserByEmail = (email) => {
  let statement = "select * from users where email = ?";
  return dbConnection
    .execute(statement, [email])
    .then(([rows, fields]) => {
      if (rows.length > 0) {
        let fullName = rows[0].fname;
        if (rows[0].lname) {
          fullName = `${rows[0].fname} ${rows[0].lname}`;
        }
        return {
          id: rows[0].id,
          name: fullName,
          email: rows[0].email,
          password: rows[0].password,
        };
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log("[ERROR][getUserByEmail] - " + err.message);
      return null;
    });
};

//Returns basic user information (id, fullname, email)
exports.getUserById = (id) => {
  let statement = "select * from users where id = ?";
  return dbConnection
    .execute(statement, [id])
    .then(([rows, fields]) => {
      if (rows.length > 0) {
        let fullName = rows[0].fname;
        if (rows[0].lname) {
          fullName = `${rows[0].fname} ${rows[0].lname}`;
        }
        return {
          id: rows[0].id,
          name: fullName,
          email: rows[0].email,
        };
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log("[ERROR][getUserById] - " + err.message);
      return null;
    });
};

//Returns complete user information
exports.getUserByIdVerbose = (id) => {
  let statement = "select * from users where id = ?";
  return dbConnection
    .execute(statement, [id])
    .then(([rows, fields]) => {
      if (rows.length > 0) {
        return rows[0];
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log("[ERROR][getUserByIdVerbose] - " + err.message);
      return null;
    });
};

exports.registerUser = (name, email, password, callback) => {
  let hashedPassword = "";
  //Check if email exists. SQL is case insensitive in selecting data
  let statement = "select email from users where email = ?";
  dbConnection
    .execute(statement, [email])
    .then(([rows, fields]) => {
      if (rows.length <= 0) {
        //User is not yet in database. Hash the password
        return bcrypt.hash(password, saltRounds);
      } else {
        //User already exists
        throw new Error("User already exists.");
      }
    })
    //Create stripe Customer Object
    .then((hash) => {
      hashedPassword = hash;

      return createStripeCustomer(email);
    })
    //Insert new user in databse
    .then((stripeCustomerId) => {
      let statement =
        "insert into users(id, stripeCustomerId, fname, email, password) values (uuid(), ?, ?, ?, ? )";
      return dbConnection.execute(statement, [
        stripeCustomerId,
        name,
        email,
        hashedPassword,
      ]);
    })
    //Successfully inserted user. Return null errors and row result
    .then(([rows, fields]) => {
      callback(null, rows);
    })
    //Return error to the caller
    .catch((err) => {
      console.log("[ERROR][registerUser] - " + err.message);
      callback(err, null);
    });
};

exports.deleteUser = (id) => {
  //ANGEL TODO - when deleting a user, delete all the other table references
  let statement = "delete from users where id = ?";
  return dbConnection
    .execute(statement, [id])
    .then(([rows, fields]) => {
      console.log(rows);
      return rows;
    })
    .catch((err) => {
      console.log("[ERROR][deleteUser] - " + err.message);
      return null;
    });
};

exports.userHasPremiumAccess = async (userId) => {
  //Check if user has subscription with status "active"
  const userWithActiveSub = await exports.getActiveSubscriptionByUserId(userId);

  if (userWithActiveSub) {
    if (userWithActiveSub.subscription.cancel_at_period_end === 1) {
      //User recently canceled the subscription. Check if past due the period end
      const nowInTicks = Math.floor(Date.now() / 1000);
      if (userWithActiveSub.subscription.cancel_at >= nowInTicks) {
        //With active, recently canceled subscription that has not reached the period end yet
        return true;
      } else {
        //Unlikely case. But just in case, retrieve from stripe the latest status of subscription
        const subscription = await retrieveSubscription(
          userWithActiveSub.subscription.id
        );

        if (subscription) {
          if (subscription.status === "canceled") {
            //Must have not received the webhook properly. Manually delete the entry in database
            await exports.deleteTableRowById(
              "subscriptions",
              userWithActiveSub.subscription.id
            );
            return false;
          } else if (subscription.status === "active") {
            await exports.updateSubscription(subscription);
            return true;
          } else {
            await exports.updateSubscription(subscription);
            return false;
          }
        } else {
          //No record of the subscription in stripe.
          //Delete entry in database
          await exports.deleteTableRowById(
            "subscriptions",
            userWithActiveSub.subscription.id
          );
          return false;
        }
      }
    } else {
      //With active subscription and NOT recently canceled
      return true;
    }
  } else {
    //No active subscription
    return false;
  }
};

//Subscriptions
exports.getStripeCustomerId = (userId) => {
  let statement = "select * from users where id = ?";
  return dbConnection
    .execute(statement, [userId])
    .then(([rows, fields]) => {
      if (rows.length > 0) {
        return rows[0].stripeCustomerId;
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log(
        "[ERROR][getStripeCustomerId] - " + userId + " - " + err.message
      );
      return null;
    });
};

exports.addSubscription = async (sub) => {
  const subscription = await exports.getTableRow("subscriptions", "id", sub.id);

  if (subscription) {
    //Somehow this subscription is already existing
    return false;
  }

  let statement =
    "insert into subscriptions values (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  return dbConnection
    .execute(statement, [
      sub.id,
      sub.customer,
      sub.current_period_end,
      sub.status,
      sub.items.data[0].price.id,
      sub.items.data[0].price.product,
      sub.latest_invoice.id,
      sub.cancel_at_period_end,
      sub.cancel_at,
    ])
    .then(([rows, fields]) => {
      if (rows.length > 0) {
        return true;
      }
      return false;
    })
    .catch((err) => {
      console.log("[ERROR][addSubscription] - " + err.message);
      return false;
    });
};

exports.getActiveSubscriptionByUserId = (id) => {
  let statement =
    "select users.id, users.fname, users.lname, users.email, subscriptions.id as subId, subscriptions.status, subscriptions.current_period_end, " +
    "subscriptions.product_price_id, subscriptions.latest_invoice_id, subscriptions.cancel_at_period_end, subscriptions.cancel_at " +
    "from users left join subscriptions on ( users.stripeCustomerId = subscriptions.stripeCustomerId and subscriptions.status = 'active') " +
    "where users.id = ? order by subscriptions.current_period_end desc limit 1";

  return dbConnection
    .execute(statement, [id])
    .then(([rows, fields]) => {
      if (rows.length > 0) {
        if (rows[0].subId && rows[0].status === "active") {
          return {
            id: rows[0].id,
            fname: rows[0].fname,
            lname: rows[0].lname,
            email: rows[0].email,
            subscription: {
              id: rows[0].subId,
              status: rows[0].status,
              current_period_end: rows[0].current_period_end,
              product_price_id: rows[0].product_price_id,
              latest_invoice_id: rows[0].latest_invoice_id,
              cancel_at_period_end: rows[0].cancel_at_period_end,
              cancel_at: rows[0].cancel_at,
            },
          };
        }
      }

      return null;
    })
    .catch((err) => {
      console.log("[ERROR][getActiveSubscriptionByUserId] - " + err.message);
      return null;
    });
};

exports.getSubscriptionByUserId = (id) => {
  let statement =
    "select users.id, subscriptions.id as subId, subscriptions.status, subscriptions.current_period_end, " +
    "subscriptions.product_price_id, subscriptions.latest_invoice_id, subscriptions.cancel_at_period_end, subscriptions.cancel_at " +
    "from users left join subscriptions on ( users.stripeCustomerId = subscriptions.stripeCustomerId) " +
    "where users.id = ? order by subscriptions.current_period_end desc limit 1";

  return dbConnection
    .execute(statement, [id])
    .then(([rows, fields]) => {
      if (rows.length > 0) {
        return {
          id: rows[0].id,
          subscription: {
            id: rows[0].subId,
            status: rows[0].status,
            current_period_end: rows[0].current_period_end,
            product_price_id: rows[0].product_price_id,
            latest_invoice_id: rows[0].latest_invoice_id,
            cancel_at_period_end: rows[0].cancel_at_period_end,
            cancel_at: rows[0].cancel_at,
          },
        };
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log("[ERROR][getSubscriptionByUserId] - " + err.message);
      return null;
    });
};

exports.updateSubscription = async (subscription) => {
  const subscriptionFromDb = await exports.getTableRow(
    "subscriptions",
    "id",
    subscription.id
  );

  if (subscriptionFromDb) {
    let latestInvoiceId;
    if (subscription.latest_invoice.id) {
      latestInvoiceId = subscription.latest_invoice.id;
    } else {
      latestInvoiceId = subscription.latest_invoice;
    }

    const newData = {
      current_period_end: subscription.current_period_end,
      status: subscription.status,
      product_price_id: subscription.plan.id,
      product_id: subscription.plan.product,
      latest_invoice_id: latestInvoiceId,
      cancel_at_period_end: subscription.cancel_at_period_end,
      cancel_at: subscription.cancel_at,
    };

    await exports.updateTableRowById("subscriptions", subscription.id, newData);
  } else {
    console.error(
      "=====updateSubscription subscription does not exists: " + subscription.id
    );
    //await exports.addSubscription(subscription);
  }
};

exports.deleteSubscription = (id) => {
  let statement = "delete from subscriptions where id = ?";
  return dbConnection
    .execute(statement, [id])
    .then(([rows, fields]) => {
      console.log(rows);
      return rows;
    })
    .catch((err) => {
      console.log("[ERROR][deleteSubscription] - " + err.message);
      return null;
    });
};

//Update Customer Payment Details
const updateCustomerPaymentDetails = async (customer) => {
  const user = await exports.getTableRow(
    "users",
    "stripeCustomerId",
    customer.id
  );

  if (
    user &&
    user.default_paymentmethod_id !==
      customer.invoice_settings.default_payment_method
  ) {
    //User's default payment method has changed
    //Retrieve user's default payment method details from stripe
    const paymentMethodDetails = await getDefaultPaymentMethodDetails(
      customer.invoice_settings.default_payment_method
    );

    //Update users table with new info
    await exports.updateTableRow("users", "stripeCustomerId", customer.id, {
      default_paymentmethod_id: paymentMethodDetails.id,
      default_paymentmethod_card_brand: paymentMethodDetails.cardBrand,
      default_paymentmethod_card_last4: paymentMethodDetails.cardLast4,
    });
  }
};

exports.updateCustomer = async (customer) => {
  if (customer.object === "customer") {
    if (customer.invoice_settings) {
      //Update Customer Payment Details
      await updateCustomerPaymentDetails(customer);
    }
  } else {
    throw {
      message: "Unknown data object type in updateCustomer Request",
    };
  }
};

exports.addInvoice = async (invoice) => {
  const invoiceFromDB = await exports.getTableRow("invoices", "id", invoice.id);

  if (invoiceFromDB) {
    //Somehow this invoice is already existing
    return false;
  }

  const charge = invoice.charge ? await retrieveCharge(invoice.charge) : null;

  let product = null;
  const withLineItems = invoice.lines.data.length > 0 ? true : false;
  if (withLineItems) {
    product = getProductById(invoice.lines.data[0].plan.id);
  }

  let statement =
    "insert into invoices values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  return dbConnection
    .execute(statement, [
      invoice.id,
      invoice.number,
      invoice.customer,
      invoice.created,
      product ? `${product.name} ${product.recurring}` : null,
      withLineItems ? invoice.lines.data[0].period.start : invoice.period_start,
      withLineItems ? invoice.lines.data[0].period.end : invoice.period_end,
      charge ? charge.payment_method_details.card.brand : null,
      charge ? charge.payment_method_details.card.last4 : null,
      invoice.total,
      invoice.status,
      invoice.payment_intent.id
        ? invoice.payment_intent.id
        : invoice.payment_intent, //payment_intent_id
      invoice.payment_intent.id ? invoice.payment_intent.status : null, //payment_intent_status
      charge ? charge.receipt_url : null, //receipt_url
      invoice.charge,
    ])
    .then(([rows, fields]) => {
      if (rows.length > 0) {
        return true;
      }
      return false;
    })
    .catch((err) => {
      console.log("[ERROR][addInvoice] - " + err.message);
      return false;
    });
};

exports.updateInvoice = async (invoice) => {
  const invoiceFromDB = await exports.getTableRow("invoices", "id", invoice.id);

  if (invoiceFromDB) {
    const withLineItems = invoice.lines.data.length > 0 ? true : false;
    let newData = {
      invoice_number: invoice.number,
      created_date: invoice.created,
      period_start: withLineItems
        ? invoice.lines.data[0].period.start
        : invoice.period_start,
      period_end: withLineItems
        ? invoice.lines.data[0].period.end
        : invoice.period_end,
      total: invoice.total,
      status: invoice.status,
      payment_intent_id: invoice.payment_intent.id
        ? invoice.payment_intent.id
        : invoice.payment_intent,
    };

    if (withLineItems) {
      const product = getProductById(invoice.lines.data[0].plan.id);

      if (product) {
        newData["product_description"] = `${product.name} ${product.recurring}`;
      }
    }

    const charge = invoice.charge ? await retrieveCharge(invoice.charge) : null;
    if (charge) {
      newData["payment_method_brand"] =
        charge.payment_method_details.card.brand;

      newData["payment_method_last4"] =
        charge.payment_method_details.card.last4;

      newData["receipt_url"] = charge.receipt_url;
      newData["charge_id"] = invoice.charge;
    }

    if (invoice.payment_intent.id) {
      newData["payment_intent_status"] = invoice.payment_intent.status;
    }

    await exports.updateTableRowById("invoices", invoice.id, newData);
  } else {
    //Invoice is not yet existing, add it in the database instead
    await exports.addInvoice(invoice);
  }
};
//Generic Helpers
exports.getTableRow = (table, colFilter, colFilterValue) => {
  let statement = `select * from ${table} where ${colFilter} = ?`;
  return dbConnection
    .execute(statement, [colFilterValue])
    .then(([rows, fields]) => {
      if (rows.length > 0) {
        return rows[0];
      }
      return null;
    })
    .catch((err) => {
      console.log("[ERROR][getTableRow] - " + err.message);
      console.log(statement);
      return null;
    });
};

exports.getTableRows = (table, colFilter, colFilterValue) => {
  let statement = `select * from ${table} where ${colFilter} = ?`;
  return dbConnection
    .execute(statement, [colFilterValue])
    .then(([rows, fields]) => {
      if (rows.length > 0) {
        return rows;
      }
      return null;
    })
    .catch((err) => {
      console.log("[ERROR][getTableRow] - " + err.message);
      console.log(statement);
      return null;
    });
};

exports.updateTableRowById = (table, id, newData) => {
  console.log("NEW DATA");
  console.log(newData);

  const columns = Object.keys(newData);
  const values = Object.values(newData);

  let setStatement = "";
  columns.forEach((column) => {
    if (setStatement === "") {
      setStatement = `${column} = ?`;
    } else {
      setStatement = `${setStatement}, ${column} = ?`;
    }
  });

  let updateStatement = `update ${table} set ${setStatement} where id = ?`;
  console.log(updateStatement);
  return dbConnection
    .execute(updateStatement, [...values, id])
    .then(([rows, fields]) => {
      if (rows.affectedRows > 0) {
        console.log(`${table} table was updated in row id ${id}`);
      }
      return true;
    })
    .catch((err) => {
      console.log("[ERROR][updateTableRowById] - " + err.message);
      return false;
    });
};

exports.updateTableRow = (table, colFilter, colFilterValue, newData) => {
  const columns = Object.keys(newData);
  const values = Object.values(newData);

  let setStatement = "";
  columns.forEach((column) => {
    if (setStatement === "") {
      setStatement = `${column} = ?`;
    } else {
      setStatement = `${setStatement}, ${column} = ?`;
    }
  });

  let updateStatement = `update ${table} set ${setStatement} where ${colFilter} = ?`;
  console.log(updateStatement);
  return dbConnection
    .execute(updateStatement, [...values, colFilterValue])
    .then(([rows, fields]) => {
      if (rows.affectedRows > 0) {
        console.log(`${table} table was updated in row id ${colFilterValue}`);
      }
      return true;
    })
    .catch((err) => {
      console.log("[ERROR][updateTableRow] - " + err.message);
      return false;
    });
};

exports.deleteTableRowById = (table, id) => {
  let statement = `delete from ${table} where id = ?`;
  return dbConnection
    .execute(statement, [id])
    .then(([rows, fields]) => {
      if (rows.affectedRows > 0) {
        console.log(`${table} table at id ${id} was deleted.`);
      }
      return true;
    })
    .catch((err) => {
      console.log("[ERROR][deleteTableRowById] - " + err.message);
      return false;
    });
};
