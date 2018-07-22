import {NextFunction, Request, Response} from "express";

const GlobalVarService = require("../services/GlobalVarService");


//api: basePath -> returns basePath
module.exports.getBasePath = function (req: Request, res: Response, next: NextFunction) {
    console.log("[SettingsController] basePath requested and sent");
    let globalVarService = new GlobalVarService();
    res.status(200).json({basePath: globalVarService.getBasePath()});
}