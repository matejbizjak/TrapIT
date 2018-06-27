import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Site} from "./Site";
import {Path} from "./Path";

@Entity()
export class Media {

    @PrimaryGeneratedColumn({name: "media_id"})
    mediaId: number;

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

    @ManyToOne(type => Site)
    @JoinColumn({name: "site_id"})
    siteId: Site;

    @ManyToOne(type => Path)
    @JoinColumn({name: "path_id"})
    pathId: Path;
}
