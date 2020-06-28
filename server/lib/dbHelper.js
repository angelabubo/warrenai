const dbConnection = require("./dbConnection");
const { createStripeCustomer } = require("./stripeHelper");

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
        return {
          id: rows[0].id,
          name: rows[0].name,
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
  console.log("=====CALLED getUserById");

  return exports.getSubscriptionByUserId(id);

  let statement = "select * from users where id = ?";
  return dbConnection
    .execute(statement, [id])
    .then(([rows, fields]) => {
      if (rows.length > 0) {
        return {
          id: rows[0].id,
          name: rows[0].name,
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
      let statement = "insert into users values (uuid(), ?, ?, ?, ? )";
      return dbConnection.execute(statement, [
        name,
        email,
        hashedPassword,
        stripeCustomerId,
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

exports.addSubscription = (sub) => {
  let statement = "insert into subscriptions values (?, ?, ?, ?, ?, ?)";
  return dbConnection
    .execute(statement, [
      sub.id,
      sub.customer,
      sub.current_period_end,
      sub.status,
      sub.items.data[0].price.id,
      sub.items.data[0].price.product,
    ])
    .then(([rows, fields]) => {
      if (rows.length > 0) {
        return true;
      }
    })
    .catch((err) => {
      console.log("[ERROR][addSubscription] - " + err.message);
      throw err;
    });
};

exports.getSubscriptionByUserId = (id) => {
  console.log("=====CALLED getSubscriptionByUserId");

  let statement =
    "select users.id, users.name, users.email, subscriptions.status, subscriptions.current_period_end, subscriptions.product_price_id from users left join subscriptions on ( users.stripeCustomerId = subscriptions.stripeCustomerId and subscriptions.status = 'active') where users.id = ? order by subscriptions.current_period_end desc limit 1";

  return dbConnection
    .execute(statement, [id])
    .then(([rows, fields]) => {
      if (rows.length > 0) {
        return {
          id: rows[0].id,
          name: rows[0].name,
          email: rows[0].email,
          subscription: {
            status: rows[0].status,
            current_period_end: rows[0].current_period_end,
            product_price_id: rows[0].product_price_id,
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
  console.log("INSIDE SERVER dbHelper updateSubscription");

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

//Generic Helpers
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
