import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import {User} from "./User";

@Entity()
export class Role {

    @PrimaryGeneratedColumn()
    role_id: number;

    @Column()
    role: string;

    @OneToMany(type => User, user => user.role_id)
    users: User[];
}
