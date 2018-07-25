import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: "root"
})
export class ApiService {

    constructor(private http: HttpClient) {
    }

    // any api call, embed it iniside api: string
    apiCall(api: string) {
        return this.http.get(api);
    }
}
