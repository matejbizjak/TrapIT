import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {ProjectTag} from "./ProjectTag";
import {MediaProject} from "./MediaProject";

@Entity()
export class Project {

    @PrimaryGeneratedColumn({name: "project_id"})
    projectId: number;

    @Column()
    name: string;

    @OneToMany(type => ProjectTag, projectTag => projectTag.projectId)
    projectTags: ProjectTag[];

    @OneToMany(type => MediaProject, mediaProjekct => mediaProjekct.projectId)
    mediaProjects: MediaProject[];
}