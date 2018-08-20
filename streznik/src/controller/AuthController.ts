import {NextFunction, Request, Response} from "express";
import * as jwt from "jsonwebtoken";
import * as fs from "fs";
import {User} from "../entity/User";
import {getRepository} from "typeorm";
import * as bcrypt from "bcrypt";

const AuthService = require("../services/AuthService");

module.exports.login = function (req: Request, res: Response, next: NextFunction) {
    const authService = new AuthService();
    const RSA_PRIVATE_KEY = fs.readFileSync("resources/rsa-key/private.key");

    const username = req.body.username,
        password = req.body.password;

    authService.preveriUpImeInGeslo(username, password).then(
        (user: User) => {
            const jwtBearerToken = jwt.sign({
                user_info: user
            }, RSA_PRIVATE_KEY, {
                algorithm: 'RS256',
                expiresIn: "12h"
            });
            // send the JWT back to the user
            res.status(200).json({
                idToken: jwtBearerToken
            });
        }, () => {
            res.sendStatus(401);
        }).catch(err => {
        res.sendStatus(400).json({
            error: err
        });
    });
};

module.exports.geslo = function (req: Request, res: Response, next: NextFunction) {
    const authService = new AuthService();
    const userRepository = getRepository(User);
    const username = req.body.user;
    const oldPswd = req.body.old;
    const newPswd = req.body.new;
    const confPswd = req.body.conf;

    authService.preveriUpImeInGeslo(username, oldPswd).then(() => {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newPswd, salt, function(err, hash) {
                console.log(err);
            });
        });
        /*
        if (newPswd === confPswd) {
            userRepository.createQueryBuilder("user")
                .update(User)
                .set({password: ""})
                .where("username = :name", {name: username})
                .execute()
                .then(() => {
                    res.sendStatus(200);
                }, (err) => {
                    res.sendStatus(500);
                });
        } else {
            res.sendStatus(400);
        }
        */
        res.sendStatus(200);
    }, () => {
        res.sendStatus(401);
    }).catch(err => {
        res.sendStatus(400).json({
            error: err
        });
    });
}