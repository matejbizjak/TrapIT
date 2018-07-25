import {NextFunction, Request, Response} from "express";
import {Media} from "../entity/Media";
import {MediaTag} from "../entity/MediaTag";
import {TagShrani} from "../entity/requests/tag-shrani";

const SlikaService = require("../services/SlikaService");
const GlobalVarService = require("../services/GlobalVarService");

//const basePath = "D:/OneDrive - inc/FRI/3. letnik/2. semester/PKP/slike";  // TODO
//const basePath = "F:/TrapIT";  // TODO

const options = {
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
};

let globalVarService = new GlobalVarService();

module.exports.dobiSliko = function (req: Request, res: Response, next: NextFunction) {
    let pot = req.params.pot.replace(/\|/g, "/");

    res.sendFile(globalVarService.getBasePath() + pot, options, (err) => {
        if (err) {
            console.log(err);
        }
    });
};

module.exports.shraniTage = function (req: Request, res: Response, next: NextFunction) {
    const slikaService = new SlikaService();
    const podatki: TagShrani = req.body.podatki;
    podatki.potDoSlike = podatki.potDoSlike.replace(/\|/g, "/");
    slikaService.shraniTage(req.body.podatki).then(
        () => {
            res.status(200).json();
        }, () => {
            res.status(400).json();
        }
    )
};

module.exports.dobiTage = function (req: Request, res: Response, next: NextFunction) {
    const slikaService = new SlikaService();
    const potDoSlike: string = req.params.pot.replace(/\|/g, "/");
    slikaService.dobiMediaId(potDoSlike).then(
        (media: Media) => {
            if (media !== undefined) {
                slikaService.dobiTage(media.mediaId).then(
                    (tagi: MediaTag[]) => {
                        res.status(200).json({tagi: tagi});
                    }, (err) => {
                        res.status(400).json({err: err});
                    }
                )
            }
            else {
                res.status(400).json({err: "Podatkov o sliki ni v bazi"});
            }
        }, (err) => {
            res.status(400).json({err: err});
        }
    );
};

module.exports.nastaviPot = function (req: Request, res: Response, next: NextFunction) {
    globalVarService.setBasePath(req.body.pot);
    res.status(200).json({message: "Success"});
};