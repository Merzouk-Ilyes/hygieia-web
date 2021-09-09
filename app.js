require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");

const sequelize = require("./util/database");
const usersRoutes = require("./routes/users/users");
const { verifyToken } = require("./middleware/verifyToken");
const socket = require("socket.io");
var moment = require('moment');
app.set("views", "views");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;
var server = app.listen(PORT, function () {
  var host = server.address().address
  var port = server.address().port
});
const io = socket(server);
io.on("connection", function (socket) {
  console.log("Made socket connection");

  socket.on("disconnect", function () {
    console.log("Made socket disconnected");
  });

  socket.on("send-notification", function (data) {
    io.emit("new-notification", data);
  });

});
//Required for parsing data



app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());

//using cookie parser
app.use(cookieParser());

// redirected to the users route
//(ALL FUNCTIONS CONCERNING AUTHENTICATION & ACCOUNT MANAGEMENT)
app.use("/users", usersRoutes);
app.get("/protected", verifyToken, (req, res) => {
  res.json({
    message: "this is a protected route only logged in people can see it",
  });
});

//Syncing the database for changes & listening to the server
sequelize
  .sync()
  .then((result) => {
   
  })
  .catch((err) => {
    console.log(err);
  });
  io.emit("send-notification", {
    "msg" : "jfbd"
  });
exports.sendNotif = function(title,description,iduser){
  var date = new Date(); 
   moment(date).format('YYYY-MM-DD hh:mm') 
  io.emit("new-notification",{
    "iduser" : iduser , 
    "title" : title,
     "description" : description, 
     'date': date ,
   });
  }