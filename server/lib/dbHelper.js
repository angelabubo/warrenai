const dbConnection = require("./dbConnection");
const { createStripeCustomer } = require("./stripeHelper");

//Hashing + Salting Passwords
const bcrypt = require("bcryptjs");
const saltRounds = 10;

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
  //Check if email exists. SQL is case insensitive in selecting data
  //delete from users where id='03a8c191-a6aa-11ea-9806-086266b3719a';
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

exports.updateUser = (id, newData) => {
  // UPDATE table_name SET column1 = value1, column2 = value2,...
  // WHERE condition;

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

  let updateStatement = `update users set ${setStatement} where id = ?`;
  return dbConnection
    .execute(statement, [...values, id])
    .then(([rows, fields]) => {
      console.log(rows);
      return rows;
    })
    .catch((err) => {
      console.log("[ERROR][updateUser] - " + err.message);
      return null;
    });
};

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
