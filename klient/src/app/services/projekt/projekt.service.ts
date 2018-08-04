import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Tag} from "../../models/entities/tag.entity";
import {TagZInputValue} from "../../models/entities/custom/tag-z-input-value";
import {TagParent} from "../../models/entities/custom/tag-parent";
import {FiltriranjeNastavitve} from "../../models/entities/custom/filtriranje-nastavitve";

export interface Projekt {
    projectId: number;
    name: string;
}

export interface ProjektTag {
    projectTagId: number;
    active: boolean;
    tagId: Tag;
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
        const url = "/projekt/tagi/" + projectId;
        // const url = "/projekt/tagi";

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

    dobiKorenskeTage() {
        const url = "/projekt/korenskiTagi";
        return this.http.get(url);
    }

    shraniTageProjekta(projTags: ProjektTag[]) {
        const url = "/projekt/projekti";
        return this.http.post(url, projTags);
    }

    shraniNovProjekt(newProjName: string, newProjTags: ProjektTag[]) {
        const url = "/projekt/novProjekt";
        return this.http.post(url, {newProjName, newProjTags});
    }

    izbrisiProjekt(projId: number) {
        const url = "/projekt/del";
        return this.http.post(url, {projId});
    }

    filtrirajSlike(izbraniTagi: TagZInputValue[], nastavitve: FiltriranjeNastavitve, mediaId: number = null) {
        const url = "/projekt/filter";
        return this.http.post(url, {tagi: izbraniTagi, nastavitve: nastavitve, mediaId: mediaId});
    }

    pretovriVOblikoZaPosiljatFiltriranje(tagi: TagParent[]): Promise<TagZInputValue[]> { // TagParent[] pretvori v seznam id-tagov
        return new Promise<TagZInputValue[]>(resolve => {
            const oznaceniTagi: TagZInputValue[] = [];

            for (const tag of tagi) {
                if (tag.input && tag.inputValue !== null) {
                    oznaceniTagi.push(new TagZInputValue(tag.tagId, tag.inputValue));
                } else if (tag.selectedChild) {
                    if (tag.checkbox && tag.selectedChild && tag.selectedChild.name === "false") { // ker zelimo, da ce je false iscemo
                        // tiste ki imajo false ali tiste brez te znacke
                        continue;
                    }
                    oznaceniTagi.push(new TagZInputValue(tag.tagId, null));
                    // do tu shranjen 1. nivo

                    if (tag.selectedChild.name === "false") { // ker zelimo, da ce je false iscemo tiste ki imajo false ali tiste
                        // brez te znacke
                        continue;
                    }
                    oznaceniTagi.push(new TagZInputValue(tag.selectedChild.tagId, tag.selectedChild.inputValue));

                    if (tag.selectedChild.selectedChild) {
                        if (tag.selectedChild.selectedChild.name === "false") { // ker zelimo, da ce je false iscemo tiste ki imajo false
                            // ali tiste brez te znacke
                            continue;
                        }
                        oznaceniTagi.push(new TagZInputValue(tag.selectedChild.selectedChild.tagId,
                            tag.selectedChild.selectedChild.inputValue));

                        if (tag.selectedChild.selectedChild.selectedChild) {
                            if (tag.selectedChild.selectedChild.selectedChild.name === "false") { // ker zelimo, da ce je false iscemo
                                // tiste ki imajo false ali tiste brez te znacke
                                continue;
                            }
                            oznaceniTagi.push(new TagZInputValue(tag.selectedChild.selectedChild.selectedChild.tagId,
                                tag.selectedChild.selectedChild.selectedChild.inputValue));
                        }
                    }
                }
            }
            resolve(oznaceniTagi);
        });
    }
}
