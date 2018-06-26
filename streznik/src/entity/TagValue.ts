import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Tag} from "./Tag";

@Entity()
export class TagValue {

    @PrimaryGeneratedColumn({name: "tag_value_id"})
    tagValueId: number;

    @Column()
    value: string;

    @Column()
    input: boolean;

    @ManyToOne(type => Tag)
    @JoinColumn({name: "tag_id"})
    tagId: Tag
}