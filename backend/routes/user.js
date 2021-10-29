"use strict"

const express = require("express");
const router = express.Router();
const {validate, passwordValidator } = require("../middleware/validator")

const userCtrl = require("../controllers/user");

router.post("/signup", passwordValidator(), validate, userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;