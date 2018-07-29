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
    const slikaService = new SlikaService();

    slikaService.dobiMedia(req.params.mediaId).then(
        (media: Media) => {
            res.sendFile(media.pathId.value + media.name, options, (err) => {
                if (err) {
                    res.status(400).json();
                }
            });
        }, (err) => {
            res.status(400).json();
        }
    );
};

module.exports.shraniTage = function (req: Request, res: Response, next: NextFunction) {
    const slikaService = new SlikaService();

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

    slikaService.dobiMedia(req.params.mediaId).then(
        (media: Media) => {
            slikaService.dobiTage(media.mediaId).then(
                (tagi: MediaTag[]) => {
                    res.status(200).json({tagi: tagi});
                }, (err) => {
                    res.status(400).json({err: err});
                }
            )
        }, (err) => {
            res.status(400).json();
        }
    );
};

module.exports.nastaviPot = function (req: Request, res: Response, next: NextFunction) {
    globalVarService.setBasePath(req.body.pot);
    res.status(200).json({message: "Success"});
};