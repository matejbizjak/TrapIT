import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";

const authRouter = require('./routes/Auth.router');
const projektRouter = require('./routes/Projekt.router');
const slikaRouter = require('./routes/Slika.router');
const tagRouter = require('./routes/Tag.router');

createConnection().then(async connection => {

    // create express app
    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));

    // cors rules
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        next();
    });

    // register routes
    app.use('/api/auth', authRouter);
    app.use('/api/projekt', projektRouter);
    app.use('/api/slika', slikaRouter);
    app.use('/api/tag', tagRouter);

    // start express server
    app.listen(3000);

    console.log("Express server has started on port 3000.");

}).catch(error => console.log(error));
