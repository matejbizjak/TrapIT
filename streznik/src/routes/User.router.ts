import * as fs from "fs";

const express = require('express');
const router = express.Router();
const jwt = require("express-jwt");

const UserController = require("../controller/UserController");
const security = require("./security");

const RSA_PUBLIC_KEY = fs.readFileSync("resources/rsa-key/public.key");

const prijavljen = jwt({
    secret: RSA_PUBLIC_KEY,
    userProperty: "payload"
});

router.get('/users', prijavljen, UserController.getAll);

router.post('/update', prijavljen, UserController.update);

router.get('/delete/:id', prijavljen, UserController.delete);

router.post('/create', prijavljen, UserController.update);

module.exports = router;