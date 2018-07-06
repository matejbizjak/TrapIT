import {getConnection, getRepository} from "typeorm";
import {Media} from "../entity/Media";
import {MediaTag} from "../entity/MediaTag";
import {TagShrani} from "../entity/requests/tag-shrani";

module.exports = class SlikaService {
    private mediaRepository = getRepository(Media);
    private mediaTagRepository = getRepository(MediaTag);

    public async dobiMediaId(potDoSlike: string): Promise<Media> {
        const potSplit: string[] = potDoSlike.split("/");
        const potZaIskanje = "/" + potSplit[3] + "/" + potSplit[4];
        const media = await this.mediaRepository.findOne({
            where: {name: potZaIskanje},
            relations: ["siteId", "pathId"]
        });
        return new Promise<Media>(resolve => {
            resolve(media);
        });
    }

    public async shraniTage(podatki: TagShrani): Promise<any> { // TODO not any
        const media: Media = await this.dobiMediaId(podatki.potDoSlike);

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