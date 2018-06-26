import {Role} from "./role.entity";

export class User {
    public userId: number;
    public username: string;
    public password: string;
    public roleId: Role;
}
