//globally used variables for paths (mainly used for GlobalVarService)
export namespace  GlobalServiceVariables {
    export var basePath: string = "D:/PKP/slike"; //used for searching images on different path
    export var databasePath: string = ""; //might be used for replacing with a constatnt (so we do not need to always change the shit in the database)
                                          // example: in code databasePath.replace(replacable, constant)
                                            // where replacable is some prefix of databasePath, that is replaced with a constant
}