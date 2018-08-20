import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {PrijavaRequest} from "../../models/requests/prijava.request";
import * as moment from "moment";
import {JwtResponse} from "../../models/responses/jwt.response";
import * as jwtDecode from "jwt-decode";
import {User} from "../../models/entities/user.entity";
import {AuthEmitter} from "../emitters/auth.emitter";

@Injectable()
export class AuthService {

    constructor(private http: HttpClient, private emitter: AuthEmitter) {
    }

    prijaviUporabnika(uporabnik: PrijavaRequest): Promise<any> {
        const url = "/auth/login";

        return new Promise((resolve, reject) => {
            this.http.post(url, uporabnik).subscribe(
                (res: JwtResponse) => {
                    this.nastaviSejo(res);
                    resolve();
                },
                (err) => {
                    reject(err);
                }
            );
        });
    }

    nastaviSejo(authRes: JwtResponse) {
        const decoded = jwtDecode(authRes.idToken);
        const expiresAt = decoded.exp;
        localStorage.setItem("trapitIdToken", authRes.idToken);
        localStorage.setItem("trapitExpiresAt", JSON.stringify(expiresAt.valueOf()));
        localStorage.setItem("trapitUserInfo", JSON.stringify(decoded.user_info));
        this.emitter.sporociSprememboAvtentikacije(true);
    }

    odjaviUporabnika() {
        localStorage.removeItem("trapitIdToken");
        localStorage.removeItem("trapitExpiresAt");
        localStorage.removeItem("trapitUserInfo");
        localStorage.removeItem("trapitImeProjekta");
        localStorage.removeItem("trapitMozniTagi");
        this.emitter.sporociSprememboAvtentikacije(false);
    }

    public jePrijavljen() {
        return moment().isBefore(this.getExpiration());
    }

    public jeOdjavljen() {
        return !this.jePrijavljen();
    }

    public trenutniUporabnik(): User {
        return <User> JSON.parse(localStorage.getItem("trapitUserInfo"));
    }

    getExpiration() {
        const expiration = localStorage.getItem("trapitExpiresAt");
        const expiresAt = JSON.parse(expiration) * 1000;
        return moment(expiresAt);
    }

    getTokenId(): string {
        return localStorage.getItem("trapitIdToken");
    }

    spremeniGeslo(old: string, nEw: string, conf: string) {
        const url = "/auth/geslo";

        return new Promise((resolve, reject) => {
            this.http.post(url, {user: JSON.parse(localStorage.getItem("trapitUserInfo")).username, old: old, nEw: nEw, conf: conf}).subscribe(
                () => {
                    resolve();
                },
                (err) => {
                    reject(err);
                }
            );
        });
    }
}
