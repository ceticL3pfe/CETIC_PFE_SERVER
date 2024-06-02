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

const { getUsers, activateUsers, addMission, deleteUser, editPassword, User } = require("../models/User");
const { sendVerificationEmail, verifyEmailToken } = require('../config/email');


// Admin Registration Route
router.post("/register-admin", async (req, res) => {
  await userRegister(req.body, "admin", res);
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
  let respons
  const {  password ,code,email} = req.body;
  console.log(req.body, "//")

  if(!verifyEmailToken(code)){
    return res.status(501).send("code is incorrect")

  }
  if (!email) {
    return res.status(500).send("userId to delete is required")
  }
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 12);

    respons = await User.updateOne({email:email}, { password: hashedPassword });
    console.log(respons)
  }
  // console.log(respons)
  if (!respons) {
    return res.status(500).json({ success: false, message: "error while updating user" })
  }
  // console.log(respons)
  res.status(200).json({ success: true, message: 'password updated successfully' })

})


router.put("/:userId", async (req, res) => {
  let respons
  const userId = req.params.userId;
  const { username, email, password, image } = req.body;
  console.log(req.body,"//")
  if (!userId) {
    return res.status(500).send("userId to delete is required")
  }
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 12);

    respons = await User.findByIdAndUpdate(userId, { password: hashedPassword });
    console.log(respons)
  }
  // console.log(respons)
  if (!respons) {
    return res.status(500).json({ success: false, message: "error while updating user" })
  }
  // console.log(respons)
  res.status(200).json({ success: true, message: 'password updated successfully' })

})

router.delete("/", async (req, res) => {
  const { id } = req.body;

  const rep = deleteUser(id)
  if (!rep) {
    return res.status(501).json({ success: false, msg: "failed to delete user" })

  }

  res.status(200).json({ success: true, msg: "user deleted successfully" })

})


module.exports = router;
