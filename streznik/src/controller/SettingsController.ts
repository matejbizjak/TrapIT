import {NextFunction, Request, Response} from "express";
import {settings} from "cluster";

const GlobalVarService = require("../services/GlobalVarService");
const SettingsService = require("../services/SettingsService");


//api: basePath -> returns basePath
module.exports.getBasePath = function (req: Request, res: Response, next: NextFunction) {
    print("basePath requested and sent to client");
    let globalVarService = new GlobalVarService();
    res.status(200).json({basePath: globalVarService.getBasePath()});
}

//api: folders/:name -> returns all available folder paths with the name that was sent to the server
module.exports.getAvailableFolders = function (req: Request, res: Response, next: NextFunction) {
    print("folders requested by name:" + req.params.name);
    var settingsService = new SettingsService();

    //promise solving from settings service
    settingsService.findAvailableFolders(req.params.name).then(
        (folders: string[]) => {
            //found folders with the given name
            if(folders.length) {
                res.status(200).json({folders: folders,
                                            serverReply: "Previdno izberite katero izmed spodnjih map želite dodati!"});
            } else {
                res.status(200).json({folders: null,
                                            serverReply: "Mapa pod podanim imenom " + req.params.name + " ne obstaja, preverite podatke in poskusite ponovno."});
            }
        },() =>{
            //basePath is shit, bad admin
            res.status(200).json({folders: null,
                                        serverReply: "Trenutna pot do slik ne obstaja. Preverite nastavitve in jo pravilno nastavite!"})
        });
}

//api: folders/add/:path -> saves new pictures data to database media table and retrieves added picture information
module.exports.addFolderToDatabase = function (req: Request, res: Response, next: NextFunction) {
    const folderPath = req.params.path;
    var settingsService = new SettingsService();
    print("got request to add folder with path: " + folderPath);

    settingsService.findAllMediaInFolder(folderPath).then((allFiles: string[]) => {
        if(allFiles.length) {
            settingsService.importArrayOfPaths(allFiles);
            res.status(200).json({files: allFiles,
                                        serverReply: "Spodaj priakazane datoteke so bile shranjene v podatkovno bazo:"});
        } else {
            res.status(200).json({files: null,
                                        serverReply: "Mapa ne vsebuje slik ali videoposnetkov."});
        }
    }, () => {
        res.status(200).json({folders: null,
            serverReply: "Prišlo je do napake pri uvozu teh slik."});
    });
}


//private console logging for settingsController
function print(msg: string){
    console.log("[SettingsController] " + msg);
}
