import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Tag} from "../../models/entities/tag.entity";

export interface Projekt {
    projectId: number;
    name: string;
}

export interface ProjektTag {
    projectTagId: number;
    active: boolean;
    tagValues: Tag;
}

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

    nastaviPot(pot: String) {
        const url = "/projekt/pot";
        return this.http.post(url, {pot: pot});
    }

    dobiProjekte() {
        const url = "/projekt/projekti";
        return this.http.get(url);
    }

    dobiTageProjekta(projId: number) {
        const url = "/projekt/projekti/" + projId;
        return this.http.get(url);
    }

    shraniTageProjekta(projTags: ProjektTag[]) {
        const url = "/projekt/projekti/";
        return this.http.post(url, projTags);
    }
}
