let mysql = require("mysql");

let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Fasya251513", //ganti pake password mysql klen
  port: 3306,
  database: "spa",
});

connection.connect(function (err) {
  if (!!err) {
    console.log(err);
  } else {
    console.log("Connected");
  }
});

module.exports = connection;
