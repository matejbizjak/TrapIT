import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Project} from "./Project";
import {Tag} from "./Tag";

@Entity()
export class ProjectTag {

    @PrimaryGeneratedColumn({name: "project_tag_id"})
    projectTagId: number;

    @ManyToOne(type => Project)
    @JoinColumn({name: "project_id"})
    projectId: Project;

    @ManyToOne(type => Tag)
    @JoinColumn({name: "tag_id"})
    tagId: Tag;

    @Column({name: "active"})
    active: boolean;
}