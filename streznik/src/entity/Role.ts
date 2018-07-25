import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User";

@Entity()
export class Role {

    @PrimaryGeneratedColumn({name: "role_id"})
    roleId: number;

    @Column()
    role: string;

    @OneToMany(type => User, user => user.roleId)
    users: User[];
}
