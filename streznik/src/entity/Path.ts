import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Media} from "./Media";

@Entity()
export class Path {

    @PrimaryGeneratedColumn()
    path_id: number;

    @Column()
    value: string;

    @OneToMany(type => Media, media => media.path_id)
    medias: Media[];
}