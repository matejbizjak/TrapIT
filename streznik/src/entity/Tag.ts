import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {ProjectTag} from "./ProjectTag";

@Entity()
export class Tag {

    @PrimaryGeneratedColumn({name: "tag_id"})
    tagId: number;

    @Column()
    name: string;

    @ManyToOne(type => Tag)
    @JoinColumn({name: "parent_tag_id"})
    parentTagId: Tag;

    @OneToMany(type => Tag, tag => tag.parentTagId)
    tags: Tag[];

    @OneToMany(type => ProjectTag, projectTag => projectTag.tagId)
    projectTags: ProjectTag[];
}