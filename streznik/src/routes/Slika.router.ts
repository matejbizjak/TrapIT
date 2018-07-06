import * as fs from "fs";

const express = require('express');
const router = express.Router();
const jwt = require("express-jwt");

const SlikaController = require("../controller/SlikaController");
const security = require("./security");

const RSA_PUBLIC_KEY = fs.readFileSync("resources/rsa-key/public.key");

const prijavljen = jwt({
    secret: RSA_PUBLIC_KEY,
    userProperty: "payload"
});

// middleware that is specific to this router
// router.use(function timeLog(req, res, next) {
//     console.log('Time: ', Date.now());
//     next()
// });

// tako bi zavaroval api, da mora biti user prijavljen in mora biti reviewer
// router.post('/login', prijavljen, security.jeReviewer, AuthController.login);

router.get('/slika/:pot', SlikaController.dobiSliko);
router.post('/tagi/', SlikaController.shraniTage);
router.get('/tagi/:pot', SlikaController.dobiTage);

router.post('/pot', SlikaController.nastaviPot);

module.exports = router;