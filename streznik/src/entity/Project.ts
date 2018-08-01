import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {ProjectTag} from "./ProjectTag";
import {Media} from "./Media";

@Entity()
export class Project {

    @PrimaryGeneratedColumn({name: "project_id"})
    projectId: number;

    @Column()
    name: string;

    @OneToMany(type => ProjectTag, projectTag => projectTag.projectId)
    projectTags: ProjectTag[];

    @OneToMany(type => Media, media => media.mediaId)
    medias: Media[];
}