import {NextFunction, Request, Response} from "express";
import * as fs from "fs";
import {Tag} from "../entity/Tag";
import {Project} from "../entity/Project";
import {ProjectTag} from "../entity/ProjectTag";

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

module.exports.dobiProjekte = function (req: Request, res: Response, next: NextFunction) {
    const projektService = new ProjektService();

    projektService.dobiProjekte().then(
        (projekti: Project[]) => {
            res.status(200).json(projekti);
        }, (err) => {
            res.status(400).json({err: err});
        }
    );
};

module.exports.dobiTageProjekta = function(req: Request, res: Response, next: NextFunction) {
    const projectID = parseInt(req.url.split("/")[2]);

    const projektService = new ProjektService();

    projektService.dobiTageProjekta(projectID).then(
        (data: ProjectTag[]) => {
            res.status(200).json(data);
        }, (err) => {
            res.status(400).json({err: err});
        }
    );
}

module.exports.shraniTageProjekta = function(req: Request, res: Response, next: NextFunction) {

    const projektService = new ProjektService();

    projektService.shraniTageProjekta(req.body).then(() => {
        res.status(200);
    }, (err) => {
        res.status(400).json({err: err});
    });
}