import {getConnection, getRepository} from "typeorm";
import {Media} from "../entity/Media";
import {MediaTag} from "../entity/MediaTag";
import {TagShrani} from "../entity/requests/tag-shrani";
import * as fs from "fs";
import {Request} from "express";
import {Response} from "express";

module.exports = class SlikaService {
    private mediaRepository = getRepository(Media);
    private mediaTagRepository = getRepository(MediaTag);

    public async dobiMedia(mediaId: number): Promise<Media> {
        const media = await this.mediaRepository.findOne({
            where: {mediaId: mediaId},
            relations: ["siteId", "pathId"]
        });
        return new Promise<Media>(resolve => {
            resolve(media);
        });
    }

    public streamVideo(req: Request, res: Response, video: Media){
        const path = video.pathId.value + video.name;
        const stat = fs.statSync(path);
        const fileSize = stat.size;
        const range = <string> req.headers.range;
        const videoType = video.name.split(".").pop();

        if(range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1]
                ? parseInt(parts[1], 10)
                : fileSize - 1;
            const chunkSize = (end - start) + 1;
            const file = fs.createReadStream(path, {start, end});
            let head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
                'Content-Type': 'video/' + videoType,
            }

            res.writeHead(206, head);
            file.pipe(res);
        } else {
            let head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/' + videoType,
            }

            res.writeHead(200, head)
            fs.createReadStream(path).pipe(res);
        }
    }

    public async shraniTage(podatki: TagShrani): Promise<any> {
        const media: Media = podatki.media;

        if (!podatki.mediaData.empty) {
            podatki.mediaData.empty = false;
        }
        if (!podatki.mediaData.interesting) {
            podatki.mediaData.interesting = false;
        }

        await getConnection().createQueryBuilder().update(Media).set({
            empty: podatki.mediaData.empty,
            interesting: podatki.mediaData.interesting, comment: podatki.mediaData.comment
        }).where("mediaId = :id", {id: podatki.media.mediaId}).execute();

        // TODO ne brisat tagov če so že not

        await getConnection().createQueryBuilder().delete().from(MediaTag)
            .where("tag_id IN (:...idji)", {idji: podatki.idVsehTagovVProjektu})
            .andWhere("media_id = :mediaId", {mediaId: media.mediaId})
            .execute();

        for (const tag of podatki.oznaceniTagi) {
            const mediaTag = new MediaTag(podatki.user, tag.tagId, media, tag.inputValue);
            await this.mediaTagRepository.save(mediaTag);
        }
    }

    public dobiTage(mediaId: number): Promise<MediaTag[]> {
        return new Promise<MediaTag[]>((resolve, reject) => {
            this.mediaTagRepository.find({where: {mediaId: mediaId}, relations: ["tagId"]}).then(
                (mediaTags: MediaTag[]) => {
                    resolve(mediaTags);
                }, (err) => {
                    console.log(err);
                    reject();
                }
            );
        });
    }
};