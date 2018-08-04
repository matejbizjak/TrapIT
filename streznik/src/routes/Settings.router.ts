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

//this routing is for SettingsController,
//TODO sctrictly under Admin permissions

//returns current set BasePath
router.get('/basePath', SettingsController.getBasePath);
//returns all avalible folders with the name
router.get('/folder/:name', SettingsController.getAvailableFolders);
//adds folder with path to SQL database
router.get('/folder/add/:path', SettingsController.addFolderToDatabase);
//get paths
router.get('/paths', SettingsController.getAllPaths);


module.exports = router;