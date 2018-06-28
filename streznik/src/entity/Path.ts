import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Media} from "./Media";

@Entity()
export class Path {

    @PrimaryGeneratedColumn({name: "path_id"})
    pathId: number;

    @Column()
    value: string;

    @OneToMany(type => Media, media => media.pathId)
    medias: Media[];
}