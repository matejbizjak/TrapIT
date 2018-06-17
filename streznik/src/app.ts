import * as express from "express";
import * as bodyParser from "body-parser";
import {Routes} from "./routes";
import "reflect-metadata";
import {createConnection} from "typeorm";
import {InitDatabase} from "./services/init-database/initDatabase";


createConnection().then(async connection => {

    // create express app
    const app = express();

    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next);
            console.log(result);
        });
    });

    // setup express app here
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));

    // napolni bazo s sifranti
    // InitDatabase.init(connection);

    // start express server
    app.listen(3000);

    console.log("Express server has started on port 3000.");

}).catch(error => console.log(error));
