"use strict"

const express = require("express");
const router = express.Router();

const sauceCtrl = require("../controllers/sauce");

const auth = require("../middleware/auth"); // Importé depuis le fichier multer-config dans middleware
const multer = require("../middleware/multer-config");

router.get("/sauces", auth, sauceCtrl.getAllSauce);
router.post("/sauces", auth, multer, sauceCtrl.createSauce);
router.get("/sauces/:id", auth, sauceCtrl.getOneSauce);
router.put("/sauces/:id", auth, multer, sauceCtrl.modifySauce);
router.delete("/sauces/:id", auth, multer, sauceCtrl.deleteSauce);
router.post("/sauces/:id/like", auth, sauceCtrl.likeSauce);

module.exports = router;
