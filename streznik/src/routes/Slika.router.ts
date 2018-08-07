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

router.get('/slika/:mediaId', SlikaController.dobiSliko);
router.get('/video/:mediaId', SlikaController.dobiVideo);
router.post('/tagi/', prijavljen, SlikaController.shraniTage);
router.get('/tagi/:mediaId', prijavljen, SlikaController.dobiTage);

router.post('/pot', prijavljen, security.jeAdmin, SlikaController.nastaviPot);

module.exports = router;