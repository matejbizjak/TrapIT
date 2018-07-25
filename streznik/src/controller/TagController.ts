import {NextFunction, Request, Response} from "express";
import {Tag} from "../entity/Tag";

const TagService = require("../services/TagService");

module.exports.saveNewTag = function (req: Request, res: Response, next: NextFunction) {
    const tagService = new TagService;
    tagService.saveNewTag(req.body.newTag[0], null).then(() => {
        tagService.updateProjectTag(req.body.newTag[0]).then(() => {
            res.status(200).json({message: "Success"});
        }, (err) => {
            res.status(500).json(err);
        });
    }, (err) => {
        res.status(500).json({message: "Name_Exists"});
    });
};

module.exports.getChildren = function (req: Request, res: Response, next: NextFunction) {
    const tagService = new TagService;
    const tagId = parseInt(req.url.split("/")[2]);

    tagService.getParent(tagId).then((parent: Tag) => {
        tagService.dobiPodTage(parent).then((tags: Tag[]) => {
            res.status(200).json(tagService.getChildren(parent, tags));
        }, (err) => {
            res.status(500).json(err);
        });
    }, (err) => {
        res.status(500).json(err);
    });
};

module.exports.updateTag = function (req: Request, res: Response, next: NextFunction) {
    const tagService = new TagService;

    tagService.updateTag(req.body.tag).then(() => {
        res.status(200).json({message: "Success"});
    }, (err) => {
        res.status(500);
    });
};

module.exports.deleteTag = function (req: Request, res: Response, next: NextFunction) {
    const tagService = new TagService;

    tagService.deleteTag(req.body.tag, 0).then(() => {
        res.status(200).json({message: "Success"});
    }, (err) => {
        res.status(500);
    });
};