const express = require("express");
const { wrapAsync } = require("../Utils/WrapAsync");
const router = express.Router();
const User = require("../MODELS/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const { signup } = require("../Controller/user.js");
const userController = require("../Controller/user.js");

//router.route = it optimize and compact because it combines the same Path/Route.

router.route("/signup")
.get(  userController.rendersignupForm)
.post( wrapAsync(userController.signup));

router.route("/login")
.post( saveRedirectUrl , userController.renderloginForm)
.post( passport.authenticate("local" , {
    failureRedirect : "/login",failureFlash : true,
}),userController.login)


router.get("/logout" , userController.logout);
module.exports = router;