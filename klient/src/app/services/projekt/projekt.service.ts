import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class ProjektService {

    constructor(private http: HttpClient) {
    }

    dobiDatoteke(pot: string) {
        const url = "/projekt/dir";

        return this.http.post(url, {pot: pot});
    }

    dobiMozneTage(projectId: number) {
        // const url = "/projekt/tagi/" + projectId;
        const url = "/projekt/tagi";

        return this.http.get(url);
    }
}
