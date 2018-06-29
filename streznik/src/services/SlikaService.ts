import {getRepository} from "typeorm";
import {Media} from "../entity/Media";
import {MediaTag} from "../entity/MediaTag";

module.exports = class SlikaService {
    private mediaRepository = getRepository(Media);
    private mediaTagRepository = getRepository(MediaTag);

    public dobiMediaId(potDoSlike: string): Promise<Media> {
        const potSplit: string[] = potDoSlike.split("/");
        const potZaIskanje = "/" + potSplit[3] + "/" + potSplit[4];

        return new Promise<Media>((resolve, reject) => {
            this.mediaRepository.findOne({where: {name: potZaIskanje}, relations: ["siteId", "pathId"]}).then(
                (media: Media) => {
                    resolve(media);
                }, (err) => {
                    console.log(err);
                    reject();
                }
            );
        });
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