import * as find from "find";
import {getRepository} from "typeorm";
import {Media} from "../entity/Media";
import {Path} from "../entity/Path";
import {Site} from "../entity/Site";


const GlobalVarService = require("../services/GlobalVarService");

module.exports = class SettingsService {
    private lastRegDate: string = "2000-12-12 12:12:12";
    private mediaRepository = getRepository(Media);
    private siteRepository = getRepository(Site);
    private pathRepository = getRepository(Path);
    private globalVarService = new GlobalVarService();

    //finds all folder paths with the same name in root, rejects if basePath is invalid
    public async findAvailableFolders(name: string, root = this.globalVarService.getBasePath()): Promise<string[]> {
        var folders: string[] = [];
        return new Promise<string[]>((resolve, reject) => {
            find.dir(root, (allFolders: string[]) => {
                for (var folder of allFolders) {
                    if (folder.endsWith(name)) folders.push(folder);
                }
                resolve(folders);
            }).error((err) => {
                console.log(err);
                reject();
            });
        });
    }

    //finds all files in path directory and all its subdirectories
    public async findAllMediaInFolder(path: string): Promise<string[]> {
        var fileNames: string[];
        return new Promise<string[]>((resolve, reject) => {
            find.file(path, (fileNames: string[]) => {
                resolve(fileNames);
            }).error((err) => {
                console.log(err);
                reject();
            });
        });
    }

    //TODO; doesn't check if the pictures are only JPEG/JPG/AVI
    async importArrayOfPaths(files: string[] = []): Promise<Result> {
        var pathLib = require('path');
        var added: number[] = [];
        var exist: number[] = [];
        var all: number = files.length;


        var image: boolean = true;
        var interesting: boolean = false;
        var comment: string = "";
        var empty: boolean = false;

        for (var i = 0; i < files.length; i++) {
            var file = await files[i];
            var data = await this.splitPath(file);
            var date = await this.getExifDate(file);
            if (date == undefined) date = this.lastRegDate;
            var siteId = (await this.getSiteId(data[data.length - 3]));
            var path = data.splice(0, data.length - 3).join(pathLib.sep) + pathLib.sep;
            var pathId = (await this.getPathId(path));

            if (file.endsWith("AVI") || file.endsWith("avi")) image = false;
            else image = true;
            var ifSuccess = await this.insertMediaEntity(date, data[data.length - 1], image, comment, pathId, siteId);
            if (ifSuccess == "added") added.push(i);
            else if (ifSuccess == "exists") exist.push(i);
        }
        this.print("V bazo so bile bile uvožene slike z naslednjimi rezultati. Od " + all + " jih je bilo že v bazi " + exist.length + " in dodanih je bilo " + added.length);
        return new Promise<Result>((resolve, reject) => {
            var result = new Result();
            result.added = added;
            result.exist = exist;
            resolve(result);
        })
    }

    //get date only works for JPG JPEG
    async getExifDate(path: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let dateTime: string;
            var ExifImage = require('exif').ExifImage;
            // if it is a video, return

            try {
                new ExifImage({image: path}, (error, exifData) => {
                    if (error) {
                        console.log(error.message);
                        resolve(undefined);
                    }
                    else if (exifData.exif.DateTimeOriginal != undefined) {
                        let data = (exifData.exif.DateTimeOriginal.toString()).split(" ");
                        data[0] = data[0].replace(/\:/gi, "-");
                        dateTime = data.join(" ");
                        this.lastRegDate = dateTime;
                        resolve(dateTime);
                    } else resolve(undefined);
                });
            } catch (error) {
                console.log('Error reading from exif' + error.message);
            }
        })
    }

    async getPathId(path: string): Promise<Path> {
        return new Promise<Path>((resolve, reject) => {
            this.pathRepository.findOne({value: path}).then
            ((pathEntity: Path) => {

                if (pathEntity) {
                    resolve(pathEntity);
                } else {
                    this.pathRepository.save({value: path}).then
                    ((pathEntity: Path) => {

                        this.pathRepository.findOne({pathId: pathEntity.pathId}).then
                        ((pathEntity: Path) => {
                            this.print("Saved new Path to the database by the name and id: " + pathEntity.value + " " + pathEntity.pathId);
                            resolve(pathEntity);
                        }, (err) => {
                            console.log(err);
                            reject();
                        });

                    }, (err) => {
                        console.log(err);
                        reject();
                    });

                }
            }, (err) => {
                console.log(err);
                reject();
            });
        });
    }

    //gets the Site entity if it exists, otherwise creates it and returns the new one created
    async getSiteId(site: string): Promise<Site> {
        return new Promise<Site>((resolve, reject) => {
            this.siteRepository.findOne({name: site}).then
            ((siteEntity: Site) => {
                if (siteEntity) {
                    resolve(siteEntity);
                } else {
                    this.siteRepository.save({name: site}).then
                    ((siteEntity: Site) => {
                        this.siteRepository.findOne({siteId: siteEntity.siteId}).then
                        ((siteEntity: Site) => {
                            this.print("Saved new Site to the database by the name and id: " + siteEntity.name + " " + siteEntity.siteId);
                            resolve(siteEntity);
                        }, (err) => {
                            console.log(err);
                            reject();
                        });
                    }, (err) => {
                        console.log(err);
                        reject();
                    });

                }
            }, (err) => {
                console.log(err);
                reject();
            });
        });
    }

    //just splits data depending on the linux or windows server file separator
    async splitPath(path: string): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            let data: string[] = [];
            if (path.includes("\\")) {
                data = path.split("\\");
            } else {
                data = path.split("/");
            }
            resolve(data);
        })
    }

    // insert media data inside the database
    // if it's already saved returns => "exists"
    // if it was saved returns => "saved"
    // if it could not be saved => "unable"
    async insertMediaEntity(date: string, name: string, image: boolean, comment = "", pathId: Path, siteId: Site): Promise<string> {
        if (date == undefined) date = this.lastRegDate;
        let newMedia = new Media();

        // Create the entitiy
        newMedia.date = date;
        newMedia.name = name;
        newMedia.image = image;
        newMedia.comment = comment;
        newMedia.pathId = pathId;
        newMedia.siteId = siteId;
        newMedia.interesting = false;
        newMedia.empty = false;


        return new Promise<string>((resolve, reject) =>
            // check if exists
            this.mediaRepository.findOne(newMedia).then(
                () => {
                    resolve("exists");
                }, () => {
                    //try to save the new media
                    this.mediaRepository.save(newMedia).then
                    (() => {
                            resolve("added");
                            //this.print("addded picture with name: " + name);
                        },
                        (err) => {
                            console.log(err);
                            resolve("unable");
                        });
                })
        );
    }

    //delay testing
    public async delay(ms: number) {
        await new Promise(resolve => setTimeout(() => resolve(), ms)).then(() => console.log("fired"));
    }

    //inside console logger
    print(string: string) {
        console.log("[SettingsService] " + string);
    }

}


class Result {
    added: number[];
    exist: number[];
}