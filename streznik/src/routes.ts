import {UserController} from "./controller/UserController";
import {AuthController} from "./controller/AuthController";

const rootRoute = "/api";

export const Routes = [
    // AUTH
    {
        method: "post",
        route: rootRoute + "/login",
        controller: AuthController,
        action: "login"
    }, {
        method: "get",
        route: rootRoute + "/logout",
        controller: AuthController,
        action: "logout"
    }, {
        method: "get",
        route: rootRoute + "/generatePass",
        controller: AuthController,
        action: "gen"
    },
    //
    {
        method: "get",
        route: rootRoute + "/users",
        controller: UserController,
        action: "all"
    }, {
        method: "get",
        route: rootRoute + "/users/:id",
        controller: UserController,
        action: "one"
    }, {
        method: "post",
        route: rootRoute + "/users",
        controller: UserController,
        action: "save"
    }, {
        method: "delete",
        route: rootRoute + "/users",
        controller: UserController,
        action: "remove"
    }];