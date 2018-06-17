import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";

export class AuthController {

    private userRepository = getRepository(User);

    async login(request: Request, response: Response, next: NextFunction) {
        // TODO
    }

    async logout(request: Request, response: Response, next: NextFunction) {
        // TODO
    }

}