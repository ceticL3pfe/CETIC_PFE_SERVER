const cors = require("cors");
const exp = require("express");
const bp = require("body-parser");
const passport = require("passport");
const {  PORT } = require("./config/index");
const mongoose = require('mongoose')
// Initialize the application
const app = exp();

// Middlewares
app.use(cors());
app.use(bp.json());
app.use(passport.initialize());
app.set('view engine', 'ejs')
require("./middlewares/passport")(passport);


// routes

app.use("/api/users", require("./routes/users"));
app.use("/tenderNotice", require("./routes/tenderNotice"));
app.use("/cahierCharge", require("./routes/cahierCharge"));

app.use("/", (req, res) => res.render('index'))






const conn = mongoose.connection
conn.once('open', function () {

  console.log('Connected to MongoDB!');
  app.listen(PORT, () => {
    console.log('server running on port ', PORT);
  });
});


  



