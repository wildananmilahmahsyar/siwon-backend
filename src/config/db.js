var mysql = require("mysql");

var hostname = "vaj-u.h.filess.io";
var database = "siwon_seldompen";
var port = "61001";
var username = "siwon_seldompen";
var password = "40ba829be539ebe3f9e8123ba619ab9a2c891154";

var con = mysql.createConnection({
  host: hostname,
  user: username,
  password,
  database,
  port,
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

con.query("SELECT 1+1").on("result", function (row) {
  console.log(row);
});
