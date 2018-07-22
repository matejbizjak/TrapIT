import {getRepository, In} from "typeorm";
import {Tag} from "../entity/Tag";
import {Project} from "../entity/Project";
import {ProjectTag} from "../entity/ProjectTag";
import {MediaTag} from "../entity/MediaTag";
import {TagZInputValue} from "../entity/requests/tag-z-input-value";
import {Media} from "../entity/Media";

module.exports = class ProjektService {
    private tagRepository = getRepository(Tag);
    private projectTagRepository = getRepository(ProjectTag);
    private projectRepository = getRepository(Project);
    private mediaTagRepository = getRepository(MediaTag);

    private retArr: Tag[] = new Array;

    public dobiMozneTage(projectId: number): Promise<Tag[]> {
        return new Promise<Tag[]>((resolve, reject) => {
            this.projectRepository.findOne(projectId).then((proj: Project) => {
                this.projectTagRepository.find({
                    relations: ["tagId", "tagId.parentTagId", "tagId.tags", "tagId.tags.parentTagId"],
                    where: {projectId: proj, active: true}
                }).then((projTags: ProjectTag[]) => {

                    let retArr: Tag[] = new Array;
                    projTags.forEach(element => {
                        retArr.push(element.tagId);
                        element.tagId.tags.forEach(el => {
                            retArr.push(el);
                        });
                    });

                    //console.log(retArr);

                    resolve(retArr);
                }, (err) => {
                    console.log(err);
                    reject(err);
                });
            }, (err) => {
                console.log(err);
                reject(err);
            });
        });
    }

    public dobiProjekte(): Promise<Project[]> {
        return new Promise<Project[]>((resolve, reject) => {

            this.projectRepository.find().then(
                (projekti: Project[]) => {
                    resolve(projekti);
                }, (err) => {
                    console.log(err);
                    reject();
                }
            )
        });
    }

    public dobiTageProjekta(projectId: number): Promise<ProjectTag[]> {
        return new Promise<ProjectTag[]>((resolve, reject) => {

            this.projectTagRepository.find({
                select: ["projectTagId", "tagId", "active"],
                relations: ["tagId"],
                where: {projectId: projectId}
            }).then(
                (projektTags: ProjectTag[]) => {
                    resolve(projektTags);
                }, (err) => {
                    console.log(err);
                    reject();
                }
            )
        });
    }

    public dobiKorenskeTage(): Promise<Tag[]> {
        return new Promise<Tag[]>((resolve, reject) => {

            this.tagRepository.find({where: {parentTagId: null}}).then(
                (rootTags: Tag[]) => {
                    resolve(rootTags);
                }, (err) => {
                    console.log(err);
                    reject();
                }
            )
        });
    }

    public shraniTageProjekta(tags: ProjectTag[]): Promise<any> {
        return new Promise((resolve, reject) => {
            tags.forEach((element) => {
                this.projectTagRepository.update(element.projectTagId, {active: element.active}).then(() => {
                    resolve();
                }, (err) => {
                    console.log(err);
                    reject();
                });
            });
        });
    }

    public shraniNovProjekt(projName: string, projTags: ProjectTag[]): Promise<any> {
        return new Promise((resolve, reject) => {
            this.projectRepository.insert({name: projName}).then(() => {
                this.projectRepository.findOne({where: {name: projName}}).then((proj: Project) => {
                    projTags.forEach((element) => {

                        this.projectTagRepository.insert({
                            projectId: proj,
                            tagId: element.tagId,
                            active: element.active
                        }).then(() => {
                            resolve("Success");
                        }, (err) => {
                            console.log(err);
                            reject(err);
                        });
                    });
                }, (err) => {
                    console.log(err);
                    reject(err);
                });
            }, (err) => {
                console.log(err);
                reject(err);
            });
        });
    }

    public izbrisiProjekt(projId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.projectRepository.findOne(projId).then((proj: Project) => {
                this.projectTagRepository.delete({projectId: proj}).then(() => {
                    this.projectRepository.delete({projectId: projId}).then(() => {
                        resolve("Success");
                    }, (err) => {
                        console.log(err);
                        reject();
                    });
                }, (err) => {
                    console.log(err);
                    reject();
                });
            }, (err) => {
                console.log(err);
                reject();
            });
        });
    }

    public filtrirajPodatke(filtri: TagZInputValue[]): Promise<Media[]> {
        return new Promise((resolve, reject) => {

            const filtriArr: number[] = [];
            for (const filtriKey of filtri) {
                filtriArr.push(filtriKey.tagId);
            }

            this.mediaTagRepository.find({
                where: {tagId: In(filtriArr)},
                relations: ["tagId", "mediaId", "mediaId.siteId"],
                order: {mediaId: "ASC"}
            }).then(
                (mediaTags: MediaTag[]) => {
                    this.izlusciMediaIdje(mediaTags, filtriArr).then((medijiZaPrikaz: Media[]) => {
                            resolve(medijiZaPrikaz);
                        }
                    );
                }, (err) => {
                    reject();
                }
            );
        });
    }

    private izlusciMediaIdje(mediaTags: MediaTag[], filtri: number[]): Promise<Media[]> {
        return new Promise<Media[]>((resolve, reject) => {
            const filtriBackup: number[] = JSON.parse(JSON.stringify(filtri));
            const medijiZaPrikaz: Media[] = [];
            console.log(filtri);

            let prejsnjiMedia: Media = null;

            for (let mediaTag of mediaTags) {
                if (prejsnjiMedia === null || mediaTag.mediaId.mediaId > prejsnjiMedia.mediaId) {
                    filtri = JSON.parse(JSON.stringify(filtriBackup));
                    prejsnjiMedia = mediaTag.mediaId;
                }
                const index = filtri.findIndex(tagId => tagId === mediaTag.tagId.tagId);
                if (index > -1) {
                    filtri.splice(index, 1);
                }
                if (filtri.length === 0) {
                    medijiZaPrikaz.push(mediaTag.mediaId);
                }
            }
            resolve(medijiZaPrikaz);
        });
    }
};
