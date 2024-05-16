require('dotenv').config()
const router = require("express").Router();
const SECRET = process.env.SECRET_KEY
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

// Bring in the User Registration function
const {
  userAuth,
  userLogin,
  checkRole,
  userRegister,
  serializeUser
} = require("../utils/Auth");

const { getUsers, activateUsers, addMission, deleteUser, editPassword } = require("../models/User");
const { sendVerificationEmail, verifyEmailToken } = require('../config/email');


// Admin Registration Route
router.post("/register-admin", async (req, res) => {
  await userRegister(req.body, "admin", res);
});

// Super Admin Registration Route
router.post("/register-super-admin", async (req, res) => {
  await userRegister(req.body, "superadmin", res);
});

// Users Login Route
router.post("/login", async (req, res) => {
  await userLogin(req.body, req.body.role, res);
});



router.post("/addMission", async (req, res) => {
  console.log(req.body)
  try {
    const response = await addMission(req.body.userId, req.body.missionId)
    if (!response)
      return res.status(501).json({ success: false, msg: `fialed to add mission for user` })


    return res.status(200).json({ success: true, msg: "mission added successfully" })



  } catch (err) {
    return res.status(500).json({ success: false, msg: `fialed to add mission ${err}` })

  }

})

router.post("/password", async (req, res) => {

  const { email } = req.body

  let token = jwt.sign(
    {

      email: req.body.email
    },
    SECRET,
    { expiresIn: "7 days" }
  );


  const response = await sendVerificationEmail(email, token)
  if (!response) {
    return res.status(501).json({ success: false, msg: "failed to send email" })
  }
  res.status(200).json({ success: true, msg: "a code was sent to your email" })
})

router.put("/password", async (req, res) => {
  const { token, password,email } = req.body;


  const rep =  verifyEmailToken(token)
  if (!rep) {
    return res.status(501).json({ success: false, msg: "failed to verify token" })

  }
  const newPassword = await bcrypt.hash(password, 12);
  const response = await editPassword(newPassword, email)
  if (!response) {
    return res.status(502).json({ success: false, msg: "failed to update password" })

  }

  res.status(200).json({ success: true, msg: "user updated successfully" })

})

router.delete("/", async (req, res) => {
  const { id } = req.body;


  const rep = deleteUser(id)
  if (!rep) {
    return res.status(501).json({ success: false, msg: "failed to delete user" })

  }



  res.status(200).json({ success: true, msg: "user deleted successfully" })

})








// // Admin Login Route
// router.post("/login-manager", async (req, res) => {
//   await userLogin(req.body, "manager", res);
// });

// // Super Admin Login Route
// router.post("/login-super-admin", async (req, res) => {
//   await userLogin(req.body, "superadmin", res);
// });

// // Profile Route
// router.get("/profile", userAuth, async (req, res) => {
//   return res.json(serializeUser(req.user));
// });

// Users Protected Route
router.get(
  "/user-protectd",
  userAuth,
  checkRole(["user", "superadmin"]),
  async (req, res) => {
    return res.json("Hello User");
  }
);

// Admin Protected Route
router.get(
  "/admin-protectd",
  userAuth,
  checkRole(["admin", "superadmin"]),
  async (req, res) => {
    return res.json("Hello Admin");
  }
);

// Super Admin Protected Route
router.get(
  "/super-admin-protectd",
  userAuth,
  checkRole(["superadmin"]),
  async (req, res) => {
    return res.json("Hello Super Admin");
  }
);

// Super Admin Protected Route
router.get(
  "/super-admin-and-admin-protectd",
  userAuth,
  checkRole(["superadmin", "admin"]),
  async (req, res) => {
    return res.json("Super admin and Admin");
  }
);

module.exports = router;
