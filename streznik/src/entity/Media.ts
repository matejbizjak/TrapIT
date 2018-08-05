import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Site} from "./Site";
import {Path} from "./Path";
import {User} from "./User";
import {MediaTag} from "./MediaTag";
import {MediaProject} from "./MediaProject";

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

    @Column({name: "last_date"})
    lastDate: Date;

    @OneToMany(type => MediaTag, mediaTag => mediaTag.mediaId)
    mediaTags: MediaTag[];

    @OneToMany(type => MediaProject, mediaProject => mediaProject.mediaId)
    mediaProjects: MediaProject[];
}
