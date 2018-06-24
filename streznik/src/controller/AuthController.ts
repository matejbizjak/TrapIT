import {NextFunction, Request, Response} from "express";
import * as jwt from "jsonwebtoken";
import * as fs from "fs";
import {User} from "../entity/User";

const AuthService = require("../services/AuthService");

module.exports.login = function (req: Request, res: Response, next: NextFunction) {
    const authService = new AuthService();
    const RSA_PRIVATE_KEY = fs.readFileSync("rsa-key/private.key");

    const username = req.body.username,
        password = req.body.password;

    authService.preveriUpImeInGeslo(username, password).then(
        (user: User) => {
            const jwtBearerToken = jwt.sign({
                user_info: user
            }, RSA_PRIVATE_KEY, {
                algorithm: 'RS256',
                expiresIn: "1h"
            });
            // send the JWT back to the user
            res.status(200).json({
                idToken: jwtBearerToken
            });
        }, () => {
            res.sendStatus(401);
        }).catch(err => {
        res.sendStatus(500).json({
            error: err
        });
    });
};