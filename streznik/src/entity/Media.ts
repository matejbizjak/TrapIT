import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Site} from "./Site";
import {Path} from "./Path";
import {Tag} from "./Tag";
import {Project} from "./Project";
import {User} from "./User";

@Entity()
export class Media {

    @PrimaryGeneratedColumn({name: "media_id"})
    mediaId: number;

    @Column()
    date: string;

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

    @ManyToOne(type => User)
    @JoinColumn({name: "last_user_id"})
    lastUserId: User;

    @Column()
    lastDate: string;

    @OneToMany(type => Tag, tag => tag.parentTagId)
    tags: Tag[];

    //tole od spodaj nisem prepričan ali je prav... (hočem array vseh projektov, ki so povezani prek MediaProject tabele, podobno kot tags odzgoraj)
    @OneToMany(type => Project, project => project.projectId)
    projects: Project[];
}
