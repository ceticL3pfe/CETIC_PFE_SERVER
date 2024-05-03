const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { User } = require("../models/User");
const { SECRET } = require("../config");
const { Admin } = require("../models/admin");
const { AgentTc } = require("../models/agentTc");
const { ControlleurDeGestion } = require("../models/controlleurDeGestion");
const { Directeur } = require("../models/directeur");
const { Commission } = require("../models/commission");
/**
 * @DESC To register the user (ADMIN, SUPER_ADMIN, USER)
 */
const userRegister = async (userDets, role, res) => {
  try {
    // Validate the username
    let usernameNotTaken = await validateUsername(userDets.username);
    if (!usernameNotTaken) {
      return res.status(400).json({
        message: `Username is already taken.`,
        success: false
      });
    }

    // validate the email
    let emailNotRegistered = await validateEmail(userDets.email);
    if (!emailNotRegistered) {
      return res.status(400).json({
        message: `Email is already registered.`,
        success: false
      });
    }

    // Get the hashed password
    const password = await bcrypt.hash(userDets.password, 12);
    // create a new user
    const newUser = new User({
      ...userDets,
      password,
      role
    });

    const response = await newUser.save();

    switch (role) {
      case "admin":
        const admin = new Admin({
          matricule: response._id
        });
        await admin.save()
        break
      case "stc":
        const tc = new AgentTc({
          matricule: response._id
        });
        await tc.save()
        break
      case "controlleurDeGestion":
        const controlleurGestion = new ControlleurDeGestion({
          matricule: response._id
        });
        await controlleurGestion.save()
        break
      case "directeur":
        const directeur = new Directeur({
          matricule: response._id
        });
        await directeur.save()
        break
      case "commission":
        const commission = new Commission({
          matricule: response._id
        });
        await commission.save()
        break


    }

    return res.status(201).json({
      message: "Hurry! now you are successfully registred. Please nor login.",
      success: true
    });
  } catch (err) {
    // Implement logger function (winston)
console.log(err)
    return res.status(500).json({
      message: `Unable to create your account.,${err}`,
      success: false
    });
  }
};

/**
 * @DESC To Login the user (ADMIN, SUPER_ADMIN, USER)
 */
const userLogin = async (userCreds, role, res) => {
  let { email, password } = userCreds;
  // First Check if the username is in the database
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      message: "email is not found. Invalid login credentials.",
      success: false
    });
  }
  // We will check the role
  // if (user.role !== role) {
  //   return res.status(403).json({
  //     message: "Please make sure you are logging in from the right portal.",
  //     success: false
  //   });
  // }
  // That means user is existing and trying to signin fro the right portal
  // Now check for the password
  let isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    // Sign in the token and issue it to the user
    let token = jwt.sign(
      {
        user_id: user._id,
        role: user.role,
        username: user.username,
        email: user.email
      },
      SECRET,
      { expiresIn: "7 days" }
    );

    let result = {
      user:
      {
        _id: user._id,
        username: user.username,
        role: user.role,
        email: user.email,
        expiresIn: 168
      },
      token: `${token}`,
    };

    return res.status(200).json({
      ...result,
      message: "Hurray! You are now logged in.",
      success: true
    });
  } else {
    return res.status(403).json({
      message: "Incorrect password.",
      success: false
    });
  }
};

const validateUsername = async username => {
  let user = await User.findOne({ username });
  return user ? false : true;
};

/**
 * @DESC Passport middleware
 */
const userAuth = passport.authenticate("jwt", { session: false });
const useProtect = (req,res,next)=>{
  const token = req.params.token
  console.log(token)
  const rep =jwt.verify(token,SECRET)
  console.log(rep)
  if(rep){next()}else{res.status(401).json({success:false,msg:"you are not authaurized"})}
}
/**
 * @DESC Check Role Middleware
 */
const checkRole = roles => (req, res, next) =>
  !roles.includes(req.user.role)
    ? res.status(401).json("Unauthorized")
    : next();

const validateEmail = async email => {
  let user = await User.findOne({ email });
  return user ? false : true;
};

const serializeUser = user => {
  return {
    username: user.username,
    email: user.email,
    name: user.name,
    _id: user._id,
    updatedAt: user.updatedAt,
    createdAt: user.createdAt
  };
};

module.exports = {
  userAuth,
  useProtect,
  checkRole,
  userLogin,
  userRegister,
  serializeUser
};
