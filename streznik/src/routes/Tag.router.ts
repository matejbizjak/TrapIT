import * as fs from "fs";

const express = require('express');
const router = express.Router();
const jwt = require("express-jwt");

const TagController = require("../controller/TagController");
const security = require("./security");

const RSA_PUBLIC_KEY = fs.readFileSync("resources/rsa-key/public.key");

const prijavljen = jwt({
    secret: RSA_PUBLIC_KEY,
    userProperty: "payload"
});

router.post('/new', prijavljen, security.jeAdmin, TagController.saveNewTag);

router.get('/children/:id', prijavljen, security.jeAdmin, TagController.getChildren);

router.post('/update', prijavljen, security.jeAdmin, TagController.updateTag);

router.post('/delete', prijavljen, security.jeAdmin, TagController.deleteTag);

module.exports = router;