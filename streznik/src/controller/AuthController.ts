import {NextFunction, Request, Response} from "express";
import {AuthService} from "../services/AuthService";
import * as jwt from "jsonwebtoken";
import * as fs from "fs";

export class AuthController {
    private authService: AuthService = new AuthService();

    login(req: Request, res: Response, next: NextFunction) {
        const RSA_PRIVATE_KEY = fs.readFileSync("rsa-key/private.key");

        const username = req.body.username,
            password = req.body.password;

        this.authService.preveriUpImeInGeslo(username, password).then(
            (userId: number) => {
                const jwtBearerToken = jwt.sign({}, RSA_PRIVATE_KEY, {
                    algorithm: 'RS256',
                    expiresIn: 3600,
                    subject: JSON.stringify(userId)
                });
                // send the JWT back to the user
                res.status(200).json({
                    idToken: jwtBearerToken,
                    expiresIn: 3600
                });
            }, () => {
                res.sendStatus(401);
            }).catch(err => {
            res.sendStatus(500).json({
                error: err
            });
        });

    }

    logout(req: Request, res: Response, next: NextFunction) {
        // TODO
    }

    // genHash(req: Request, res: Response, next: NextFunction) {
    //     this.authService.genHash().then(
    //         (hash) => {
    //             res.status(200).json({hash: hash});
    //         }, (err) => {
    //             res.status(500);
    //         }
    //     );
    // }

}