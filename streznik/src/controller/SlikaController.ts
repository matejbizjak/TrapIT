import {NextFunction, Request, Response} from "express";
import {Media} from "../entity/Media";
import {MediaTag} from "../entity/MediaTag";
import {ZnaniTagiZaMedia} from "../entity/responses/znani-tagi-za-media";
import {MediaData} from "../entity/custom/media-data";
import * as fs from "fs";
import * as jwt from "jsonwebtoken"

const SlikaService = require("../services/SlikaService");
const GlobalVarService = require("../services/GlobalVarService");

const RSA_PUBLIC_KEY = fs.readFileSync("resources/rsa-key/public.key");


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

function checkAuthToken(token: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        jwt.verify(token, RSA_PUBLIC_KEY, function (err) {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}

module.exports.dobiSliko = function (req: Request, res: Response, next: NextFunction) {
    const slikaService = new SlikaService();

    checkAuthToken(req.query.token).then(
        () => {
            slikaService.dobiMedia(req.params.mediaId).then(
                (media: Media) => {
                    if(media.image){
                        res.sendFile(media.pathId.value + "/" + media.name, options, (err) => {
                            if (err) {
                                res.status(400).end();
                            } else {
                                res.status(200).end();
                            }
                        });
                    } else{
                        res.status(400).json({err: "Media ni slika"}).end();
                    }

                }, (err) => {
                    res.status(400).json({err: err}).end();
                }
            );
        }
    ).catch((err) => {
        res.status(401).json({err: err}).end();
    });
};

module.exports.dobiVideo = function (req: Request, res: Response, next: NextFunction) {
    const slikaService = new SlikaService();

    checkAuthToken(req.query.token).then
    (() => {
        slikaService.dobiMedia(req.params.mediaId).then
        ((media: Media) => {
            if(media.image){
                res.status(400).json({err: "Requested media is not a video/.avi file."})
            } else {
                slikaService.streamVideo(req, res, media);
            }
        }, () => {

        })
    }, (err) => {
       // res.status(401).json({err: "Unauthorized"}).end();
    })
}

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
                    res.status(200).json(new ZnaniTagiZaMedia(tagi, new MediaData(media.empty, media.interesting, media.comment)));
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