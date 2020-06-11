const dbConfig = require("./dbConfig");
const mysql = require("mysql2/promise");

const dbConnection = mysql.createPool(dbConfig.pool);

// function dbConnectionCall() {
//   console.log("dbConnectionCall CALL");
//   console.log(dbConfig.pool);

//   return dbConnection
//     .execute("select * from users", [])
//     .then(([rows, fields]) => {
//       if (rows.length > 0) {
//         return {
//           id: rows[0].id,
//           email: rows[0].email,
//           password: rows[0].password,
//         };
//       } else {
//         return null;
//       }
//     })
//     .catch((err) => {
//       console.log("[ERROR] dbConnectionCall - " + err);
//       return null;
//     });
// }

// dbConnectionCall().then((data) => {
//   console.log(data);
// });

function dbConnectionCall() {
  console.log("dbConnectionCall CALL");
}

module.exports = dbConnection;
