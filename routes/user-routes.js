const express = require("express");
const { loginPage, registerPage, registerUser, loginUser, logout } = require("../controllers/user-controller");
const router = express.Router();

router.get("/login", loginPage);

router.get("/signup", registerPage);

router.post("/signup", registerUser);

router.post("/login", loginUser);

router.get('/logout', logout)

module.exports = router;
