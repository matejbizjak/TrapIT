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

router.post('/new', prijavljen, TagController.saveNewTag);

router.get('/children/:id', prijavljen, TagController.getChildren);

router.post('/update', prijavljen, TagController.updateTag);

router.post('/delete', prijavljen, TagController.deleteTag);

module.exports = router;