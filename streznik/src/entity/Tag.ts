import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {ProjectTag} from "./ProjectTag";
import {MediaTag} from "./MediaTag";

@Entity()
export class Tag {

    @PrimaryGeneratedColumn({name: "tag_id"})
    tagId: number;

    @Column()
    name: string;

    @Column()
    input: boolean;

    @Column()
    checkbox: boolean;

    @ManyToOne(type => Tag)
    @JoinColumn({name: "parent_tag_id"})
    parentTagId: Tag;

    @OneToMany(type => Tag, tag => tag.parentTagId)
    tags: Tag[];

    @OneToMany(type => ProjectTag, projectTag => projectTag.tagId)
    projectTags: ProjectTag[];

    @OneToMany(type => MediaTag, mediaTag => mediaTag.mediaTagId)
    mediaTags: MediaTag[];

    @Column({name: "slo_name"})
    sloName: string;
    @Column({name: "eng_name"})
    engName: string;
}
