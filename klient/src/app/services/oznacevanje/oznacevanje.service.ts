import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {TagParent} from "../../models/entities/custom/tag-parent";
import {TagShrani} from "../../models/requests/tag-shrani";
import {AuthService} from "../avtentikacija/auth.service";
import {TagZInputValue} from "../../models/entities/custom/tag-z-input-value";
import {Media} from "../../models/entities/media.entity";

@Injectable()
export class OznacevanjeService {

    constructor(private http: HttpClient, private auth: AuthService) {
    }

    dobiTage(mediaId: number) {
        const url = "/slika/tagi/" + mediaId;
        return this.http.get(url);
    }

    shraniIzpolnjeneTage(izbranMedia: Media, tagi: TagParent[], tagiZaProjektId: Set<number>): Promise<any> {
        return new Promise((resolve, reject) => {
            this.pretovriVOblikoZaPosiljat(tagi).then(
                (oznaceniTagi: TagZInputValue[]) => {
                    const podatki = new TagShrani(this.auth.trenutniUporabnik(), izbranMedia, oznaceniTagi, Array.from(tagiZaProjektId));
                    const url = "/slika/tagi/";
                    this.http.post(url, {podatki: podatki}).subscribe((res) => {
                        resolve(res);
                    }, (err) => {
                        reject(err);
                    });
                }
            );
        });
    }

    pretovriVOblikoZaPosiljat(tagi: TagParent[]): Promise<TagZInputValue[]> { // TagParent[] pretvori v seznam id-tagov
        return new Promise<TagZInputValue[]>(resolve => {
            const oznaceniTagi: TagZInputValue[] = [];

            for (const tag of tagi) {
                if (tag.input && tag.inputValue !== null) {
                    oznaceniTagi.push(new TagZInputValue(tag.tagId, tag.inputValue));
                } else if (tag.selectedChild) {
                    oznaceniTagi.push(new TagZInputValue(tag.tagId, null));
                    // do tu shranjen 1. nivo

                    oznaceniTagi.push(new TagZInputValue(tag.selectedChild.tagId, tag.selectedChild.inputValue));

                    if (tag.selectedChild.selectedChild) {
                        oznaceniTagi.push(new TagZInputValue(tag.selectedChild.selectedChild.tagId,
                            tag.selectedChild.selectedChild.inputValue));

                        if (tag.selectedChild.selectedChild.selectedChild) {
                            oznaceniTagi.push(new TagZInputValue(tag.selectedChild.selectedChild.selectedChild.tagId,
                                tag.selectedChild.selectedChild.selectedChild.inputValue));
                        }
                    }
                }
            }
            resolve(oznaceniTagi);
        });
    }

    nastaviPot(pot: String) {
        const url = "/slika/pot";
        return this.http.post(url, {pot: pot});
    }
}
