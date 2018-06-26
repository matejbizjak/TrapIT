import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User";
import {Tag} from "./Tag";
import {Media} from "./Media";
import {TagValue} from "./TagValue";

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

    @ManyToOne(type => TagValue)
    @JoinColumn({name: "tag_value_id"})
    tagValueId: TagValue;

    @Column({name: "input_value"})
    inputValue: number;
}