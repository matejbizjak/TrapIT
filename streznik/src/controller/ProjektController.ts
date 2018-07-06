import {NextFunction, Request, Response} from "express";
import * as fs from "fs";
import {Tag} from "../entity/Tag";

const ProjektService = require("../services/ProjektService");

const PotService = require("../services/PotService");

//const basePath = "D:/OneDrive - inc/FRI/3. letnik/2. semester/PKP/slike";  // TODO
//const basePath = "F:/TrapIT";  // TODO
// const basePath = "D:/";

var shranjenaPot = new PotService();

module.exports.dobiDir = function (req: Request, res: Response, next: NextFunction) {
    fs.readdir(shranjenaPot.basePath + req.body.pot, (err, files) => {
        if (err) {
            res.status(400).json({err: err});
        } else {
            res.status(200).json({files: files});
        }
    })
};

module.exports.dobiTage = function (req: Request, res: Response, next: NextFunction) {
    const projektService = new ProjektService();

    projektService.dobiMozneTage(null).then(
        (mozniTagi: Tag[]) => {
            res.status(200).json({mozniTagi: mozniTagi});
        }, (err) => {
            res.status(400).json({err: err});
        }
    );
};

module.exports.nastaviPot = function (req: Request, res: Response, next: NextFunction) {
    shranjenaPot.setBasePath(req.body.pot);
    res.status(200).json({message: "Pot uspešno nastavljena"});
};