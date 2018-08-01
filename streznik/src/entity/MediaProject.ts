import {Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Media} from "./Media";
import {Project} from "./Project";

@Entity()
export class MediaProject {

    @PrimaryGeneratedColumn({name: "media_project_id"})
    mediaProjectId: number;

    @ManyToOne(type => Media)
    @JoinColumn({name: "media_id"})
    mediaId: Media;

    @ManyToOne(type => Project)
    @JoinColumn({name: "project_id"})
    projectId: Project;

}