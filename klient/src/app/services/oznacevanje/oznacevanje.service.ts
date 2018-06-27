import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class OznacevanjeService {

    constructor(private http: HttpClient) {
    }

    dobiSliko(potDoSlik: string, imeSlike: string) {
        // const url = "/projekt/dir";
        //
        // return this.http.post(url, {pot: pot});
    }
}
