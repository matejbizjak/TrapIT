import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Role} from "./Role";

@Entity()
export class User {

    @PrimaryGeneratedColumn({name: "user_id"})
    userId: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    active: boolean;

    @ManyToOne(type => Role)
    @JoinColumn({name: "role_id"})
    roleId: Role;

}
