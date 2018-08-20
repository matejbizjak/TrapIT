import {getRepository} from "typeorm";
import {Tag} from "../entity/Tag";
import {TagWChild} from "../entity/custom/TagWChild";
import {Project} from "../entity/Project";
import {ProjectTag} from "../entity/ProjectTag";
import {MediaTag} from "../entity/MediaTag";

module.exports = class TagService {
    private tagRepository = getRepository(Tag);
    private projectRepository = getRepository(Project);
    private projTagRepository = getRepository(ProjectTag);
    private mediaTagRepository = getRepository(MediaTag);

    public saveNewTag(tag: TagWChild, parentId: Tag): Promise<any> {
        return new Promise<any>((resolve, reject) => {

            this.tagRepository.findOne({where: {name: tag.tag.name}}).then((already: Tag) => {
                if (already && parentId == null) {
                    reject({message: "Tag_Already_Exists"});
                } else {
                    this.tagRepository.createQueryBuilder()
                        .insert()
                        .into(Tag)
                        .values([
                            {
                                name: tag.tag.name,
                                parentTagId: parentId,
                                input: tag.tag.input,
                                checkbox: tag.tag.checkbox,
                                sloName: tag.tag.sloName,
                                engName: tag.tag.engName
                            }
                        ])
                        .execute().then(() => {
                        this.tagRepository.findOne({where: {name: tag.tag.name}}).then(tag1 => {
                            if (tag.tag.checkbox) {
                                this.saveNewTag({
                                    tag: {
                                        tagId: null,
                                        name: "true",
                                        checkbox: false,
                                        input: false,
                                        parentTagId: null,
                                        tags: null,
                                        projectTags: null,
                                        mediaTags: null,
                                        sloName: null,
                                        engName: null
                                    }, children: null
                                }, tag1).then(() => {
                                    this.saveNewTag({
                                        tag: {
                                            tagId: null,
                                            name: "false",
                                            checkbox: false,
                                            input: false,
                                            parentTagId: null,
                                            tags: null,
                                            projectTags: null,
                                            mediaTags: null,
                                            sloName: null,
                                            engName: null
                                        }, children: null
                                    }, tag1).then(() => {
                                        resolve();
                                    }, (err) => {
                                        console.log(err);
                                        reject(err);
                                    });
                                }, (err) => {
                                    console.log(err);
                                    reject(err);
                                });
                            } else if (tag.children) {
                                tag.children.forEach(element => {
                                    this.saveNewTag(element, tag1).then(() => {

                                        resolve();

                                    }, (err) => {
                                        console.log(err);
                                        reject(err);
                                    });
                                });
                            } else {
                                resolve();
                            }
                        }, (err) => {
                            console.log(err);
                            reject(err);
                        });
                    }, (err) => {
                        console.log(err);
                        reject(err);
                    });
                }
            });
        });
    }

    public updateProjectTag(tag: TagWChild) {
        return new Promise<any>((resolve, reject) => {
            this.tagRepository.findOne({where: {name: tag.tag.name}}).then(tag1 => {
                let found = false;
                this.projTagRepository.find({relations: ["tagId"]}).then((projTags: ProjectTag[]) => {
                    projTags.forEach(el => {
                        if (el.tagId.tagId == tag1.tagId) {
                            found = true;
                        }
                    });
                    if (!found) {
                        this.projectRepository.find().then((projects: Project[]) => {
                            projects.forEach(proj => {
                                this.projTagRepository.createQueryBuilder()
                                    .insert()
                                    .into(ProjectTag)
                                    .values({
                                        projectId: proj,
                                        tagId: tag1,
                                        active: false,
                                    })
                                    .execute().then(() => {
                                    resolve();
                                }, (err) => {
                                    console.log(err);
                                    reject(err);
                                });
                            });
                        }, (err) => {
                            console.log(err);
                            reject(err);
                        });
                    } else {
                        resolve();
                    }
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

    public getParent(tagId: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.tagRepository.findOne({where: {tagId: tagId}}).then((tag: Tag) => {
                resolve(tag);
            }, (err) => {
                console.log(err);
                reject();
            });
        });
    }

    public dobiPodTage(root: Tag): Promise<Tag[]> {
        return new Promise<Tag[]>((resolve, reject) => {

            this.tagRepository.find({relations: ["parentTagId"]}).then((tags: Tag[]) => {
                let retArr: Tag[] = new Array;
                tags.forEach(element => {
                    let rootTag = this.findRoot(element, tags);

                    if (rootTag.tagId == root.tagId) {
                        retArr.push(element);
                    }
                });

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

    public getChildren(parent: Tag, group: Tag[]): TagWChild {

        let ret: TagWChild = {tag: parent, children: new Array};

        group.forEach(el => {
            if (el.parentTagId) {
                if (el.parentTagId.tagId === parent.tagId) {
                    ret.children.push(this.getChildren(el, group));
                }
            }
        });

        return ret;
    }

    public updateTag(tag: TagWChild): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            // If tag already exists
            if (tag.tag.tagId) {
                this.tagRepository.createQueryBuilder()
                    .update(Tag)
                    .set({
                        name: tag.tag.name,
                        input: tag.tag.input,
                        checkbox: tag.tag.checkbox,
                        parentTagId: tag.tag.parentTagId,
                        sloName: tag.tag.sloName,
                        engName: tag.tag.engName
                    })
                    .where("tagId = :id", {id: tag.tag.tagId})
                    .execute().then(() => {
                    this.tagRepository.find({
                        where: {parentTagId: tag.tag},
                        relations: ["parentTagId"]
                    }).then((exChild: Tag[]) => {
                        this.tagRepository.find({relations: ["parentTagId"]}).then(all => {
                            let toBeDeleted: TagWChild[] = new Array;
                            exChild.forEach(ex => {
                                // If existing child is not in array of new children, we have to delete it
                                if (Array.from(tag.children, x => x.tag.tagId).indexOf(ex.tagId) < 0) {
                                    toBeDeleted.push(this.getChildren(ex, all));
                                }
                            });
                            this.deleteTag(toBeDeleted, 0).then(() => {
                                if (tag.children.length > 0) {
                                    tag.children.forEach(element => {
                                        this.updateTag(element).then(() => {
                                            resolve({message: "Success"})
                                        }, (err) => {
                                            console.log(err);
                                            reject(err);
                                        });
                                    });
                                } else {
                                    resolve();
                                }
                            }, (err) => {
                                console.log(err);
                                reject(err);
                            });
                        }, (err) => {
                            console.log(err);
                            reject(err);
                        });
                    }, (err) => {
                        console.log(err);
                        reject(err);
                    });
                }, (err) => {
                    console.log(err);
                    reject(err);
                });
            } else { // If tag is new
                this.tagRepository.findOne({where: {name: tag.tag.parentTagId.name}}).then(foundParent => {
                    if (tag.tag.parentTagId.tagId == null) {
                        tag.tag.parentTagId = foundParent;
                    }
                    this.tagRepository.createQueryBuilder()
                        .insert()
                        .into(Tag)
                        .values({
                            tagId: tag.tag.tagId,
                            name: tag.tag.name,
                            input: tag.tag.input,
                            checkbox: tag.tag.checkbox,
                            parentTagId: tag.tag.parentTagId,
                            sloName: tag.tag.sloName,
                            engName: tag.tag.engName
                        })
                        .execute().then(() => {
                        if (tag.tag.checkbox) {
                            this.tagRepository.findOne({
                                where: {
                                    name: tag.tag.name,
                                    parentTagId: tag.tag.parentTagId
                                }
                            }).then((tag1: Tag) => {
                                this.tagRepository.createQueryBuilder()
                                    .insert()
                                    .into(Tag)
                                    .values({name: "true", input: false, checkbox: false, parentTagId: tag1})
                                    .execute().then(() => {
                                    this.tagRepository.createQueryBuilder()
                                        .insert()
                                        .into(Tag)
                                        .values({name: "false", input: false, checkbox: false, parentTagId: tag1})
                                        .execute().then(() => {
                                        resolve({message: "Success"});
                                    }, (err) => {
                                        console.log(err);
                                        reject(err);
                                    });
                                }, (err) => {
                                    console.log(err);
                                    reject(err);
                                });
                            }, (err) => {
                                console.log(err);
                                reject(err);
                            });
                        } else if (tag.children) {
                            tag.children.forEach(tg => {
                                this.updateTag(tg).then(() => {
                                    resolve({message: "Success"});
                                }, (err) => {
                                    console.log(err);
                                    reject(err);
                                });
                            });
                        } else {
                            resolve({message: "Success"});
                        }
                    }, (err) => {
                        console.log(err);
                        reject(err);
                    });
                }, (err) => {
                    console.log(err);
                    reject(err);
                });
            }
        });
    }

    public deleteTag(tag: TagWChild[], index: number) {
        return new Promise<any>((resolve, reject) => {
            if (index >= tag.length) {
                resolve();
            } else {
                // Delete children
                this.deleteTag(tag[index].children, 0).then(() => {
                    //Delete tag
                    this.mediaTagRepository.createQueryBuilder()
                        .delete()
                        .from(MediaTag)
                        .where("tag_id = :id", {id: [tag[index].tag.tagId]})
                        .execute().then(() => {
                        this.projTagRepository.createQueryBuilder()
                            .delete()
                            .from(ProjectTag)
                            .where("tag_id = :id", {id: tag[index].tag.tagId})
                            .execute().then(() => {
                            this.tagRepository.createQueryBuilder()
                                .delete()
                                .from(Tag)
                                .where("tag_id = :id", {id: tag[index].tag.tagId})
                                .execute().then(() => {
                                //Move on
                                this.deleteTag(tag, index + 1).then(() => {
                                    resolve();
                                }, (err) => {
                                    console.log(err);
                                    reject(err);
                                });
                            }, (err) => {
                                console.log(err);
                                reject(err);
                            });
                        }, (err) => {
                            console.log(err);
                            reject(err);
                        });
                    }, (err) => {
                        console.log(err);
                        reject(err);
                    });
                }, (err) => {
                    console.log(err);
                    reject(err);
                });
            }
        });
    }
}