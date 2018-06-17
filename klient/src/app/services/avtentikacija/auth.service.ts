import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {PrijavaRequest} from "../../models/requests/prijava.request";

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) {
  }

  prijaviUporabnika(uporabnik: PrijavaRequest) {
    const url = "";
    return this.http.post(url, uporabnik); // TODO
  }
}
