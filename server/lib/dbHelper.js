const dbConnection = require("./dbConnection");
const {
  createStripeCustomer,
  getDefaultPaymentMethodDetails,
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

exports.getUserById = (id) => {
  let statement = "select * from users where id = ?";
  return dbConnection
    .execute(statement, [id])
    .then(([rows, fields]) => {
      let fullName = rows[0].fname;
      if (rows[0].lname) {
        fullName = `${rows[0].fname} ${rows[0].lname}`;
      }

      if (rows.length > 0) {
        return {
          id: rows[0].id,
          name: fullName,
          email: rows[0].email,
          // password: rows[0].password,
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

  let statement = "insert into subscriptions values (?, ?, ?, ?, ?, ?, ?)";
  return dbConnection
    .execute(statement, [
      sub.id,
      sub.customer,
      sub.current_period_end,
      sub.status,
      sub.items.data[0].price.id,
      sub.items.data[0].price.product,
      sub.latest_invoice.id,
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

//Only returns active subscriptions
exports.getSubscriptionByUserId = (id) => {
  let statement =
    "select users.id, users.fname, users.lname, users.email, subscriptions.id as subId, subscriptions.status, subscriptions.current_period_end, subscriptions.product_price_id, subscriptions.latest_invoice_id from users left join subscriptions on ( users.stripeCustomerId = subscriptions.stripeCustomerId and subscriptions.status = 'active') where users.id = ? order by subscriptions.current_period_end desc limit 1";

  return dbConnection
    .execute(statement, [id])
    .then(([rows, fields]) => {
      if (rows.length > 0) {
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
          },
          // password: rows[0].password,
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

exports.updateSubscription = async ({ priceId, data }) => {
  let subId, newData;
  if (data.object === "subscription") {
    subId = data.id;
    newData = {
      current_period_end: data.current_period_end,
      status: data.status,
      product_id: data.items.data[0].price.product,
    };
  } else if (data.object === "invoice") {
    subId = data.subscription;
    if (data.status === "paid") {
      newData = {
        status: "active",
      };
    } else {
      newData = {
        status: data.status,
      };
    }
    console.log("Inside Invoice");
    console.log(newData);
  } else {
    throw {
      message: "Unknown data object type in updateSubscription Request",
    };
  }

  if (priceId) {
    newData["product_price_id"] = priceId;
  }

  await exports.updateTableRowById("subscriptions", subId, newData);
};

exports.updateUserSubscription = async (subscription) => {
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
  };

  await exports.updateTableRowById("subscriptions", subscription.id, newData);
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

  const user = await exports.getTableRow(
    "users",
    "stripeCustomerId",
    invoice.customer
  );

  let product = null;
  const withLineItems = invoice.lines.data.length > 0 ? true : false;
  if (withLineItems) {
    product = getProductById(invoice.lines.data[0].plan.id);
  }

  let statement =
    "insert into invoices values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  return dbConnection
    .execute(statement, [
      invoice.id,
      invoice.number,
      invoice.customer,
      invoice.created,
      product ? `${product.name} ${product.recurring}` : null,
      withLineItems ? invoice.lines.data[0].period.start : invoice.period_start,
      withLineItems ? invoice.lines.data[0].period.end : invoice.period_end,
      user ? user.default_paymentmethod_card_brand : null,
      user ? user.default_paymentmethod_card_last4 : null,
      invoice.total,
      invoice.status,
      invoice.payment_intent.id
        ? invoice.payment_intent.id
        : invoice.payment_intent, //payment_intent_id
      invoice.payment_intent.id ? invoice.payment_intent.status : null, //payment_intent_status
      null, //receipt_url
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

exports.updateInvoice = async (data) => {
  if (data.object === "charge") {
    const newData = {
      created_date: data.created,
      payment_intent_id: data.payment_intent,
      payment_method_brand: data.payment_method_details.card.brand,
      payment_method_last4: data.payment_method_details.card.last4,
      receipt_url: data.receipt_url,
    };

    await exports.updateTableRowById("invoices", data.invoice, newData);
  }

  if (data.object === "invoice") {
    const withLineItems = data.lines.data.length > 0 ? true : false;
    let product = null;
    if (withLineItems) {
      product = getProductById(data.lines.data[0].plan.id);
    }

    let newData = {
      invoice_number: data.number,
      created_date: data.created,
      product_description: product
        ? `${product.name} ${product.recurring}`
        : null,
      period_start: withLineItems
        ? data.lines.data[0].period.start
        : data.period_start,
      period_end: withLineItems
        ? data.lines.data[0].period.end
        : data.period_end,
      total: data.total,
      status: data.status,
      payment_intent_id: data.payment_intent.id
        ? data.payment_intent.id
        : data.payment_intent,
    };

    if (data.payment_intent.id) {
      newData["payment_intent_status"] = data.payment_intent.status;
    }

    await exports.updateTableRowById("invoices", data.id, newData);
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
