import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User";
import {Tag} from "./Tag";
import {Media} from "./Media";

@Entity()
export class MediaTag {

    @PrimaryGeneratedColumn({name: "media_tag_id"})
    mediaTagId: number;

    @ManyToOne(type => User)
    @JoinColumn({name: "user_id"})
    userId: User;

    @ManyToOne(type => Tag)
    @JoinColumn({name: "tag_id"})
    tagId: Tag;

    @ManyToOne(type => Media)
    @JoinColumn({name: "media_id"})
    mediaId: Media;

    @Column({name: "input_value"})
    inputValue: number;
}