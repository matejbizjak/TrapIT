import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Media} from "./Media";


@Entity()
export class Site {

    @PrimaryGeneratedColumn({name: "site_id"})
    siteId: number;

    @Column()
    name: string;

    @OneToMany(type => Media, media => media.siteId)
    medias: Media[];
}