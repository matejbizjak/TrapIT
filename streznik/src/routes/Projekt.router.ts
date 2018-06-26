import * as fs from "fs";

const express = require('express');
const router = express.Router();
const jwt = require("express-jwt");

const ProjektController = require("../controller/ProjektController");
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

router.post('/dir', prijavljen, ProjektController.dobiDir);

module.exports = router;