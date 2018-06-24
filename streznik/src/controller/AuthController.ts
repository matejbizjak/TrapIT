import {NextFunction, Request, Response} from "express";
import * as jwt from "jsonwebtoken";
import * as fs from "fs";


module.exports.login = function (req: Request, res: Response, next: NextFunction) {
    const RSA_PRIVATE_KEY = fs.readFileSync("rsa-key/private.key");

    console.log("TU SEM");

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

};