import {getRepository, In} from "typeorm";
import {Tag} from "../entity/Tag";
import {Project} from "../entity/Project";
import {ProjectTag} from "../entity/ProjectTag";
import {MediaTag} from "../entity/MediaTag";
import {TagZInputValue} from "../entity/requests/tag-z-input-value";
import {Media} from "../entity/Media";
import {FiltriranjeNastavitve} from "../entity/requests/filtriranje-nastavitve";
import {SfiltriraniPodatki} from "../entity/responses/sfiltrirani-podatki";

module.exports = class ProjektService {
    private tagRepository = getRepository(Tag);
    private projectTagRepository = getRepository(ProjectTag);
    private projectRepository = getRepository(Project);
    private mediaTagRepository = getRepository(MediaTag);
    private mediaRepository = getRepository(Media);

    public dobiMozneTage(projectId: number): Promise<Tag[]> {
        return new Promise<Tag[]>((resolve, reject) => {

            this.tagRepository.find({relations: ["parentTagId", "projectTags", "projectTags.projectId"]}).then((tags: Tag[]) => {
                let retArr: Tag[] = new Array;
                tags.forEach(element => {
                    let rootTag = this.findRoot(element, tags);

                    rootTag.projectTags.forEach(projTg => {
                        if (projTg.projectId.projectId === projectId &&
                            projTg.active) {
                            retArr.push(element);
                        }
                    });
                });

                // console.log(retArr);

                resolve(retArr);
            }, (err) => {
                console.log(err);
                reject(err);
            });
        });
    }

    public findRoot(tag: Tag, tags: Tag[]) {

        tags.forEach(el => {
            if (el.tagId === tag.tagId) {
                tag = el;
            }
        });

        if (tag.parentTagId == null) {
            return tag;
        } else {
            return this.findRoot(tag.parentTagId, tags);
        }
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

    public filtrirajPodatke(filtri: TagZInputValue[], nastavitve: FiltriranjeNastavitve, mediaId?: number): Promise<SfiltriraniPodatki> {
        return new Promise((resolve, reject) => {

            if(mediaId){
                this.mediaRepository.findOne({where: {mediaId: mediaId}, relations: ["siteId"]}).then
                ((foundMedia: Media) => {
                    resolve(new SfiltriraniPodatki([foundMedia], 1));
                }, (err) => {
                    console.log(err);
                    reject();
                })
            }

            const filtriArr: number[] = [];
            for (const filtriKey of filtri) {
                filtriArr.push(filtriKey.tagId);
            }

            if (filtriArr.length === 0) { // select all
                this.mediaTagRepository.find({
                    relations: ["tagId", "mediaId", "mediaId.siteId"],
                    order: {mediaId: "ASC"}
                }).then(
                    (mediaTags: MediaTag[]) => {
                        this.izlusciMediaIdje(mediaTags, filtriArr, nastavitve).then((sfiltriraniPodatki: SfiltriraniPodatki) => {
                                resolve(sfiltriraniPodatki);
                            }
                        );
                    }, (err) => {
                        reject();
                    }
                );
            } else { // select where filtri
                this.mediaTagRepository.find({
                    where: {tagId: In(filtriArr)},
                    relations: ["tagId", "mediaId", "mediaId.siteId"],
                    order: {mediaId: "ASC"}
                }).then(
                    (mediaTags: MediaTag[]) => {
                        this.izlusciMediaIdje(mediaTags, filtriArr, nastavitve).then((sfiltriraniPodatki: SfiltriraniPodatki) => {
                                resolve(sfiltriraniPodatki);
                            }
                        );
                    }, (err) => {
                        reject();
                    }
                );
            }
        });
    }

    private izlusciMediaIdje(mediaTags: MediaTag[], filtri: number[], nastavitve: FiltriranjeNastavitve): Promise<SfiltriraniPodatki> {
        return new Promise<SfiltriraniPodatki>((resolve, reject) => {
            const filtriBackup: number[] = JSON.parse(JSON.stringify(filtri));
            let medijiZaPrikaz: Media[] = [];

            let prejsnjiMedia: Media = null;
            let dodalBool = false;

            for (let mediaTag of mediaTags) {
                if (prejsnjiMedia === null || mediaTag.mediaId.mediaId > prejsnjiMedia.mediaId) {
                    filtri = JSON.parse(JSON.stringify(filtriBackup));
                    prejsnjiMedia = mediaTag.mediaId;
                    dodalBool = false;
                }

                if (mediaTag.mediaId.mediaId === prejsnjiMedia.mediaId && dodalBool) {
                    filtri = JSON.parse(JSON.stringify(filtriBackup));
                    prejsnjiMedia = mediaTag.mediaId;
                    continue;
                }

                const index = filtri.findIndex(tagId => tagId === mediaTag.tagId.tagId);
                if (index > -1) {
                    filtri.splice(index, 1);
                }
                if (filtri.length === 0) {
                    medijiZaPrikaz.push(mediaTag.mediaId);
                    dodalBool = true;
                }
            }

            // sortiraj
            medijiZaPrikaz.sort(function (a, b) {
                return a[nastavitve.filtrirajPo] - b[nastavitve.filtrirajPo];
            });

            if (nastavitve.filtrirajAsc === false) {
                medijiZaPrikaz.reverse();
            }

            // st vseh rezultatov brez upostevanja limita
            const stVsehRezultatov = medijiZaPrikaz.length;

            // omeji (limit)
            const zacetek = (nastavitve.stStrani - 1) * nastavitve.stNaStran;
            medijiZaPrikaz = medijiZaPrikaz.slice(zacetek, zacetek + nastavitve.stNaStran);

            resolve(new SfiltriraniPodatki(medijiZaPrikaz, stVsehRezultatov));
        });
    }
};
