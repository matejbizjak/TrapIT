import * as fs from "fs";

import {Connection} from "typeorm";

export class InitDatabase {

    private static connection: Connection;

    static init(connection: Connection) {
        this.connection = connection;

        this.initRoles();
        this.initUsers();
    }

    static initRoles() {
        fs.readFile("src/services/init-database/sql/role.sql", "utf8", (err, sql) => {
            if (err) {
                console.log("Prišlo je do napake pri inicializaciji podatkov za role:", err);
            } else {
                this.connection.query(sql).then(
                    () => {
                        console.log("Uspešna inicializacija podatkov za role.");
                    }
                ).catch((err) => {
                    console.log("Prišlo je do napake pri inicializaciji podatkov za role:", err);
                })
            }
        });

    }

    static initUsers() {

    }
}