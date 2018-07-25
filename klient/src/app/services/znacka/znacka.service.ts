import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {TagWChild} from "../../controllers/dodajanje-znacke/dodajanje-znacke.component";
import {Tag} from "../../models/entities/tag.entity";

@Injectable()
export class ZnackaService {

    constructor (private http: HttpClient) {

    }

    saveNewTag(newTag: TagWChild[]) {
        return this.http.post("/tag/new", {newTag: newTag});
    }

    getChildren(root: Tag) {
        return this.http.get("/tag/children/" + root.tagId);
    }

    saveChanges(tag: TagWChild) {
        return this.http.post("/tag/update", {tag: tag});
    }

    deleteTag(tag: TagWChild[]) {
        return this.http.post("/tag/delete", {tag: tag});
    }
}
