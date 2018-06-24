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
    localStorage.setItem("id_token", authRes.idToken);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
    localStorage.setItem("user_info", JSON.stringify(decoded.user_info));
    this.emitter.sporociSprememboAvtentikacije(true);
  }

  odjaviUporabnika() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("user_info");
    this.emitter.sporociSprememboAvtentikacije(false);
  }

  public jePrijavljen() {
    return moment().isBefore(this.getExpiration());
  }

  public jeOdjavljen() {
    return !this.jePrijavljen();
  }

  public trenutniUporabnik(): User {
    return <User> JSON.parse(localStorage.getItem("user_info"));
  }

  getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration) * 1000;
    return moment(expiresAt);
  }
}
