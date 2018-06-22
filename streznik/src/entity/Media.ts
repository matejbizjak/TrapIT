import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Site} from "./Site";
import {Path} from "./Path";

@Entity()
export class Media {

    @PrimaryGeneratedColumn()
    media_id: number;

    @Column()
    date: Date;

    @Column()
    name: string;

    @Column()
    empty: boolean;

    @Column()
    image: boolean;

    @Column()
    interesting: boolean;

    @Column()
    comment: string;

    @ManyToOne(type => Site, site => site.site_id)
    site_id: number;

    @ManyToOne(type => Path, path => path.path_id)
    path_id: number;
}
