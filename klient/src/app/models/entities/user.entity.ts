import {Role} from "./role.entity";

export class User {
    public user_id: number;
    public username: string;
    public password: string;
    public role_id: Role;
}
