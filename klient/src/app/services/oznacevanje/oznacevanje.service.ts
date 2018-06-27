import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class OznacevanjeService {

    constructor(private http: HttpClient) {
    }

    // dobiSliko(potDoSlike: string) {
    //     // const url = "/slika/slika" + potDoSlike;
    //     potDoSlike = potDoSlike.replace(/\//g , "|");
    //     const url = "/slika/slika/" + potDoSlike;
    //     console.log(url);
    //     return this.http.get(url);
    //     // return this.http.post(url, {pot: potDoSlike});
    // }

    dobiTage(potDoSlike: string) {
        potDoSlike = potDoSlike.replace(/\//g, "|");
        const url = "/slika/tagi/" + potDoSlike;
        return this.http.get(url);
    }
}
