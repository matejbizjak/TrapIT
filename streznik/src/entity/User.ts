import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import {Role} from "./Role";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    user_id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @ManyToOne(type => Role, role => role.role_id)
    role_id: Role;

}
