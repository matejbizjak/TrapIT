import {NextFunction, Request, Response} from "express";
import * as fs from "fs";

const ProjektService = require("../services/ProjektService");

const basePath = "D:/OneDrive - inc/FRI/3. letnik/2. semester/PKP/slike";  // TODO
// const basePath = "D:/";

module.exports.dobiDir = function (req: Request, res: Response, next: NextFunction) {
    fs.readdir(basePath + req.body.pot, (err, files) => {
        if (err) {
            res.status(400).json({napaka: err});
        } else {
            res.status(200).json({files: files});
        }
    })
};