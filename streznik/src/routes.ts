import {UserController} from "./controller/UserController";
import {AuthController} from "./controller/AuthController";

export const Routes = [
    // AUTH
    {
        method: "post",
        route: "/login",
        controller: AuthController,
        action: "login"
    }, {
        method: "post",
        route: "/logout",
        controller: AuthController,
        action: "logout"
    },
    //
    {
        method: "get",
        route: "/users",
        controller: UserController,
        action: "all"
    }, {
        method: "get",
        route: "/users/:id",
        controller: UserController,
        action: "one"
    }, {
        method: "post",
        route: "/users",
        controller: UserController,
        action: "save"
    }, {
        method: "delete",
        route: "/users",
        controller: UserController,
        action: "remove"
    }];