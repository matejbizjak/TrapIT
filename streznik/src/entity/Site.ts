import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Media} from "./Media";


@Entity()
export class Site {

    @PrimaryGeneratedColumn()
    site_id: number;

    @Column()
    name: string;

    @OneToMany(type => Media, media => media.site_id)
    medias: Media[];
}