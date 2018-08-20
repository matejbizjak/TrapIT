import {NextFunction, Request, Response} from "express";
import * as fs from "fs";
import {Tag} from "../entity/Tag";
import {Project} from "../entity/Project";
import {ProjectTag} from "../entity/ProjectTag";
import {SfiltriraniPodatki} from "../entity/responses/sfiltrirani-podatki";

const ProjektService = require("../services/ProjektService");

const GlobalVarService = require("../services/GlobalVarService");

// const basePath = "D:/OneDrive - inc/FRI/3. letnik/2. semester/PKP/slike";  // TODO
// const basePath = "E:/TrapIT/";  // TODO
// const basePath = "D:/";

let globalVarService = new GlobalVarService();

module.exports.dobiDir = function (req: Request, res: Response, next: NextFunction) {
    fs.readdir(globalVarService.getBasePath() + req.body.pot, (err, files) => {
        if (err) {
            res.status(400).json({err: err});
        } else {
            res.status(200).json({files: files});
        }
    })
};

module.exports.dobiTage = function (req: Request, res: Response, next: NextFunction) {
    const projektService = new ProjektService();

    const projectID = parseInt(req.url.split("/")[2]);

    projektService.dobiMozneTage(projectID).then(
        (mozniTagi: Tag[]) => {
            res.status(200).json({mozniTagi: mozniTagi});
        }, (err) => {
            res.status(400).json({err: err});
        }
    );
};

module.exports.nastaviPot = function (req: Request, res: Response, next: NextFunction) {
    globalVarService.setBasePath(req.body.pot);
    res.status(200).json({message: "Success"});
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

module.exports.dobiTageProjekta = function (req: Request, res: Response, next: NextFunction) {
    const projectID = parseInt(req.url.split("/")[2]);

    const projektService = new ProjektService();

    projektService.dobiTageProjekta(projectID).then(
        (data: ProjectTag[]) => {
            res.status(200).json(data);
        }, (err) => {
            res.status(400).json({err: err});
        }
    );
};

module.exports.shraniTageProjekta = function (req: Request, res: Response, next: NextFunction) {

    const projektService = new ProjektService();

    projektService.shraniTageProjekta(req.body).then(() => {
        res.status(200);
    }, (err) => {
        res.status(400).json({err: err});
    });
};

module.exports.dobiKorenskeTage = function (req: Request, res: Response, next: NextFunction) {
    const projektService = new ProjektService();

    projektService.dobiKorenskeTage().then((data: Tag[]) => {
        res.status(200).json(data);
    }, (err) => {
        res.status(400).json({err: err});
    });
};

module.exports.shraniNovProjekt = function (req: Request, res: Response, next: NextFunction) {
    const projektService = new ProjektService();

    projektService.shraniNovProjekt(req.body.newProjName, req.body.newProjTags).then((message: string) => {
        res.status(200).json({message: message});
    }, (err) => {
        res.status(400).json({err: err});
    });
};

module.exports.izbrisiProjekt = function (req: Request, res: Response, next: NextFunction) {
    const projektService = new ProjektService();

    projektService.izbrisiProjekt(req.body.projId).then((message: string) => {
        res.status(200).json({message: message});
    }, (err) => {
        res.status(400).json({err: err});
    });
};

module.exports.filtriraj = function (req: Request, res: Response, next: NextFunction) {
    const projektService = new ProjektService();
    projektService.filtrirajPodatke(req.body.tagi, req.body.nastavitve, req.body.mediaSearch, req.body.mediaId).then(
        (sfiltriraniPodatki: SfiltriraniPodatki) => {
            res.status(200).json(sfiltriraniPodatki);
        }, (err) => {
            res.status(400).json({err: err});
        }
    );
};

module.exports.saveMediaProject = function (req: Request, res: Response, next: NextFunction) {
    const projectService = new ProjektService();

    projectService.saveMediaProject(req.params.mediaId, req.params.projectId).then
    ( (message: string) => {
        res.status(200).json(message);
    }, (err) => {
        res.status(400).json({err: err});
    })
}