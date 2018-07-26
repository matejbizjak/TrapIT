import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {User} from "../../models/entities/user.entity";

@Injectable()
export class UserService {

    constructor(private http: HttpClient) {

    }

    public getUsers() {
        return this.http.get("/user/users");
    }

    public saveUser(user: User) {
        return this.http.post("/user/update", user);
    }

    public deleteUser(user: User) {
        return this.http.get("/user/delete/" + user.userId);
    }

    public createUser(user: User) {
        return this.http.post("/user/create", user);
    }
}
