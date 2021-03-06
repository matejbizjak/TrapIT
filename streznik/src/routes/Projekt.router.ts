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

router.post('/dir', prijavljen, ProjektController.dobiDir);
// router.get('/tagi/:projectId', prijavljen, ProjektController.dobiTage); // TODO
router.get('/tagi/:id', prijavljen, ProjektController.dobiTage);

router.post('/pot', prijavljen, ProjektController.nastaviPot);

router.get('/projekti', prijavljen, ProjektController.dobiProjekte);

router.get('/projekti/:id', prijavljen, ProjektController.dobiTageProjekta);

router.post('/projekti', prijavljen, ProjektController.shraniTageProjekta);

router.get('/korenskiTagi', prijavljen, ProjektController.dobiKorenskeTage);

router.post('/novProjekt', prijavljen, ProjektController.shraniNovProjekt);

router.post('/del', prijavljen, ProjektController.izbrisiProjekt);

router.post('/filter', prijavljen, ProjektController.filtriraj);

//only reviewer :TODO
router.get('/mediaProject/save/:mediaId/:projectId',  ProjektController.saveMediaProject);

module.exports = router;