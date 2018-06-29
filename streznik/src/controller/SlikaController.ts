import {NextFunction, Request, Response} from "express";
import {Media} from "../entity/Media";
import {MediaTag} from "../entity/MediaTag";
const SlikaService = require("../services/SlikaService");

const basePath = "D:/OneDrive - inc/FRI/3. letnik/2. semester/PKP/slike";  // TODO

const options = {
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
};

module.exports.dobiSliko = function (req: Request, res: Response, next: NextFunction) {
    let pot = req.params.pot.replace(/\|/g, "/");

    res.sendFile(basePath + pot, options, (err) => {
        if (err) {
            console.log(err);
        }
    });
};

module.exports.dobiTage = function (req: Request, res: Response, next: NextFunction) {
    const slikaService = new SlikaService();
    const potDoSlike: string = req.params.pot.replace(/\|/g, "/");

    slikaService.dobiMediaId(potDoSlike).then(
        (media: Media) => {

            slikaService.dobiTage(media.mediaId).then(
                (tagi: MediaTag[]) => {
                    res.status(200).json({tagi: tagi});
                }, (err) => {
                    res.status(400).json({err: err});
                }
            )

        }, (err) => {
            res.status(400).json({err: err});
        }
    );
};