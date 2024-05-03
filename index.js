const cors = require("cors");
const exp = require("express");
const bp = require("body-parser");
const passport = require("passport");
const { PORT } = require("./config/index");
const mongoose = require('mongoose');
const { userAuth,checkRole } = require("./utils/Auth");
// Initialize the application
const app = exp();

// Middlewares
app.use(cors());
app.use(bp.json());
app.use(passport.initialize());
app.set('view engine', 'ejs')
require("./middlewares/passport")(passport);


// routes

app.use("/user", require("./routes/users"));
app.use("/admin", require('./routes/admin'))
app.use("/tenderNotice", require("./routes/tenderNotice"));
app.use("/client", require("./routes/client"));
app.use("/fournisseur", require("./routes/fournisseur"));
app.use("/cdc", require("./routes/cahierCharge"));
app.use("/aoReponse", require("./routes/aoReponse"));
app.use("/pvClient", require("./routes/clientPv"));

app.use("/*", (req, res) => res.render('index'))






const conn = mongoose.connection
conn.once('open', function () {

  console.log('Connected to MongoDB!');
  app.listen(PORT, () => {
    console.log('server running on port ', PORT);
  });
});






