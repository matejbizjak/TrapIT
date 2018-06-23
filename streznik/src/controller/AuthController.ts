import {NextFunction, Request, Response} from "express";
import {AuthService} from "../services/AuthService";
import * as jwt from "jsonwebtoken";

export class AuthController {


    constructor(private authService: AuthService) {
    }

    async login(req: Request, res: Response, next: NextFunction) {
        // const RSA_PRIVATE_KEY = fs.readFileSync('./demos/private.key');

        const username = req.body.username,
            password = req.body.password;
        console.log("tuuuuuuu");
        this.authService.preveriUpImeInGeslo(username, password).then(
            (userId: number) => {

                if (userId !== -1) {
                    const jwtBearerToken = jwt.sign({}, "aas", {
                        algorithm: 'RS256',
                        expiresIn: 120,
                        subject: userId
                    });

                    // send the JWT back to the user

                    res.status(200).json({
                        idToken: jwtBearerToken,
                        expiresIn: 3600
                    });
                }
                else {
                    res.sendStatus(401);
                }
            });

    }

    async logout(req: Request, res: Response, next: NextFunction) {
        // TODO
    }

}