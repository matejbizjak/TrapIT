import {getRepository} from "typeorm";
import {Tag} from "../entity/Tag";

module.exports = class ProjektService {
    private tagRepository = getRepository(Tag);

    public dobiMozneTage(projectId: number): Promise<Tag[]> {
        return new Promise<Tag[]>((resolve, reject) => {

            this.tagRepository.find({relations: ["parentTagId"]}).then(
                (mozniTagi: Tag[]) => {
                    resolve(mozniTagi);
                }, (err) => {
                    console.log(err);
                    reject();
                }
            )
        });
    }

};