import {GlobalServiceVariables} from "../global-variables/GlobalServiceVariables";

module.exports = class GlobalVarService {
    public setBasePath(newBasePath: string): void {
        //console.log("[PotService ] basepath <" + GlobalServiceVariables.basePath + "> set to <" + newBasePath + ">");
        GlobalServiceVariables.basePath = newBasePath;
    }

    public getBasePath(): string {
        //console.log("[PotService] basepath requested");
        return GlobalServiceVariables.basePath;
    }
};

