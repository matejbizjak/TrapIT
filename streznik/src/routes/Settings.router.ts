import * as fs from "fs";

const express = require('express');
const router = express.Router();
const jwt = require("express-jwt");

const SettingsController = require("../controller/SettingsController");
const security = require("./security");

const RSA_PUBLIC_KEY = fs.readFileSync("resources/rsa-key/public.key");

const prijavljen = jwt({
    secret: RSA_PUBLIC_KEY,
    userProperty: "payload"
});

//returns current set BasePath
router.get('/basePath', prijavljen, security.jeAdmin, SettingsController.getBasePath);
//returns all avalible folders with the name
router.get('/folder/:name', prijavljen, security.jeAdmin, SettingsController.getAvailableFolders);
//adds folder with path to SQL database
router.get('/folder/add/:path', prijavljen, security.jeAdmin, SettingsController.addFolderToDatabase);
//get paths
router.get('/paths', prijavljen, security.jeAdmin, SettingsController.getAllPaths);
//update path
router.get('/update/path/:pathId/:value', prijavljen, security.jeAdmin, SettingsController.updatePathInDatabase);


module.exports = router;