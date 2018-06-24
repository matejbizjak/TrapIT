import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";

const authRouter = require('./routes/Auth.router');

createConnection().then(async connection => {

    // create express app
    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));

    // cors allow
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        // res.header("Access-Control-Allow-Credentials", "true");
        // res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        // res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        next();
    });

    app.use('/api/auth', authRouter);

    // // register express routes from defined application routes
    // Routes.forEach(route => {
    //     (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
    //         const result = (new (route.controller as any))[route.action](req, res, next);
    //         if (result instanceof Promise) {
    //             result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);
    //
    //         } else if (result !== null && result !== undefined) {
    //             res.json(result);
    //         }
    //     });
    // });

    // setup express app here

    // start express server
    app.listen(3000);

    // // insert new users for test
    // await connection.manager.save(connection.manager.create(User, {
    //     firstName: "Timber",
    //     lastName: "Saw",
    //     age: 27
    // }));
    // await connection.manager.save(connection.manager.create(User, {
    //     firstName: "Phantom",
    //     lastName: "Assassin",
    //     age: 24
    // }));

    console.log("Express server has started on port 3000.");

}).catch(error => console.log(error));
