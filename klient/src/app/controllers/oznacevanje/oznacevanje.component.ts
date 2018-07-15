import {Component, ElementRef, Inject, OnInit, Renderer2, ViewEncapsulation} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {SharingService} from "../../services/sharing.service";
import {ProjektService} from "../../services/projekt/projekt.service";
import {OznacevanjeService} from "../../services/oznacevanje/oznacevanje.service";
import {Router} from "@angular/router";
import {Tag} from "../../models/entities/tag.entity";
import {TagParent} from "../../models/entities/custom/tag-parent.entity";
import {MediaTag} from "../../models/entities/media-tag.entity";
import {DOCUMENT} from "@angular/common";

@Component({
    selector: "app-oznacevanje",
    templateUrl: "./oznacevanje.component.html",
    styleUrls: [ './oznacevanje.component.css' ],
    encapsulation: ViewEncapsulation.None
})
export class OznacevanjeComponent implements OnInit {
    potDoMapeSlik: string;
    vseSlike: string[];
    stVsehSlikVMapi: number;
    zapStSlike: number;
    potDoSlike: string;
    projectId: number; // TODO dovoli samo tage, ki so definirani za ta projekt
    mozniTagi: TagParent[];
    mozniTagiCopy: TagParent[];
    mozniTagiSamoId: Set<number>;

    // stupid
    vstavljenih = 0;
    bul = false;

    constructor(private translate: TranslateService, private sharingService: SharingService, private projektService: ProjektService,
                private oznacevanjeService: OznacevanjeService, private router: Router, private elementRef: ElementRef,
                private renderer: Renderer2, @Inject(DOCUMENT) private document) {
    }

    ngOnInit(): void {
        this.potDoMapeSlik = this.sharingService.getItem("potDoMapeSlik");
        if (this.potDoMapeSlik === null) {
            this.router.navigate(["/projekt"]);
        }

        this.zapStSlike = 0;

        this.mozniTagiSamoId = new Set();
        this.dobiMozneTage().then(() => {
                this.dobiVseSlike().then(() => {
                    this.nastaviPoDoSlike();
                    this.dobiTage();
                }, (err) => {
                    console.log(err);
                });
            }
        );
    }

    dobiVseSlike(): Promise<any> { // dobi imena vseh slik v tej mapi
        return new Promise<any>((resolve, reject) => {
            this.projektService.dobiDatoteke(this.potDoMapeSlik).subscribe(
                (slike) => {
                    this.vseSlike = slike["files"];
                    this.stVsehSlikVMapi = this.vseSlike.length;
                    resolve();
                }, (err) => {
                    reject(err);
                }
            );
        });
    }

    nastaviPoDoSlike() {
        this.potDoSlike = this.potDoMapeSlik + this.vseSlike[this.zapStSlike];
        this.potDoSlike = this.potDoSlike.replace(/\//g, "|");
    }

    dobiMozneTage(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.projektService.dobiMozneTage(null).subscribe(
                (mozniTagi: Tag[]) => {
                    this.pretvoriTageVLepObjekt(mozniTagi["mozniTagi"]).then(
                        () => {
                            this.mozniTagiCopy = [];
                            Object.assign(this.mozniTagiCopy, JSON.parse(JSON.stringify(this.mozniTagi)));
                            resolve();
                            console.log(this.mozniTagi);
                        }
                    );
                }, (err) => {
                    console.log(err);
                    reject();
                }
            );
        });
    }

    prejsnjaSlika() {
        this.shraniVnose();
        if (this.zapStSlike !== 0) {
            this.zapStSlike--;
            this.nastaviPoDoSlike();
            this.dobiTage();
            this.mozniTagi = new Array();
            Object.assign(this.mozniTagi, JSON.parse(JSON.stringify(this.mozniTagiCopy)));
        }
    }

    naslednjaSlika() {
        this.shraniVnose();
        if (this.zapStSlike !== this.stVsehSlikVMapi - 1) {
            this.zapStSlike++;
            this.nastaviPoDoSlike();
            this.dobiTage();
            this.mozniTagi = new Array();
            Object.assign(this.mozniTagi, JSON.parse(JSON.stringify(this.mozniTagiCopy)));
        }
    }

    dobiTage() {
        this.oznacevanjeService.dobiTage(this.potDoSlike).subscribe(
            (tagi: MediaTag[]) => {
                this.napolniZeZnaneTage(tagi["tagi"]);
            }, (err) => {
                console.log(err.error);
            }
        );
    }

    napolniZeZnaneTage(tagi: MediaTag[]) {
        const stNaPrvemNivoju = {};

        for (const tag of this.mozniTagi) {
            stNaPrvemNivoju[Number(tag.tagId)] = 0;
        }

        for (let i = 0; i < tagi.length; i++) {
            if (stNaPrvemNivoju.hasOwnProperty(Number(tagi[i].tagId.tagId))) {
                stNaPrvemNivoju[Number(tagi[i].tagId.tagId)]++;

                if (!tagi[i].inputValue) {
                    tagi.splice(i, 1);
                    i--;
                }
            }
        }

        for (let i = 0; i < this.mozniTagi.length; i++) {
            if (stNaPrvemNivoju[Number(this.mozniTagi[i].tagId)] > 1) {
                for (let j = 0; j < stNaPrvemNivoju[Number(this.mozniTagi[i].tagId)] - 1; j++) {
                    const copy: TagParent = new TagParent(null, null, null, null, null, null, null, null, null);
                    Object.assign(copy, JSON.parse(JSON.stringify(this.mozniTagi[i])));
                    i++;
                    this.mozniTagi.splice(i, 0, copy);
                }
            }
        }
        // konec dodajanja praznih na prvem nivoju

        for (const tag of tagi) {
            this.najdiInNastaviIzbranega(tag);
        }
    }

    najdiInNastaviIzbranega(tag: MediaTag) {
        for (const tag1 of this.mozniTagi) {
            if (tag1.tagId === tag.tagId.tagId && tag1.napolnjen !== true) {
                tag1.inputValue = tag.inputValue;
                tag1.napolnjen = true;
                return;
            }

            for (const tag2 of tag1.childTags) {
                if (tag2.tagId === tag.tagId.tagId && tag1.napolnjen !== true) {
                    tag2.inputValue = tag.inputValue;
                    tag1.selectedChild = tag2;
                    tag1.napolnjen = true;
                    tag1.checkboxValue = tag.tagId.name === "true";
                    return;
                }

                for (const tag3 of tag2.childTags) {
                    if (tag3.tagId === tag.tagId.tagId && tag1.selectedChild.tagId === tag2.tagId && tag2.napolnjen !== true) {
                        tag3.inputValue = tag.inputValue;
                        tag2.selectedChild = tag3;
                        tag2.napolnjen = true;
                        return;
                    }

                    for (const tag4 of tag3.childTags) {
                        if (tag4.tagId === tag.tagId.tagId && tag1.selectedChild.tagId === tag2.tagId &&
                            tag2.selectedChild.tagId === tag3.tagId && tag3.napolnjen !== true) {
                            tag4.inputValue = tag.inputValue;
                            tag3.selectedChild = tag4;
                            tag3.napolnjen = true;
                            return;
                        }
                    }
                }
            }
        }
    }

    jeIzbralNivo(el, parentTag: TagParent) {
        let izbranTag: TagParent;

        if (parentTag.checkbox) {
            for (const childTag of parentTag.childTags) {
                if (parentTag.checkboxValue && childTag.name === "true") {
                    izbranTag = childTag;
                } else if (parentTag.checkboxValue === false && childTag.name === "false") {
                    izbranTag = childTag;
                }
            }
        } else {
            for (const childTag of parentTag.childTags) {
                if (childTag.tagId === Number(el.target.value)) {
                    izbranTag = childTag;
                }
            }
        }

        for (const mozniTagiKey of this.mozniTagi) {
            if (mozniTagiKey === parentTag) {
                mozniTagiKey.selectedChild = izbranTag;
            } else {
                for (const childTag of mozniTagiKey.childTags) {
                    if (childTag === parentTag) {
                        childTag.selectedChild = izbranTag;
                    } else {
                        for (const childTag1 of childTag.childTags) {
                            if (childTag1 === parentTag) {
                                childTag1.selectedChild = izbranTag;
                            }
                        }
                    }
                }
            }
        }
    }

    zapisiSteviloZivali(el, parentTag: TagParent) {
        parentTag.inputValue = Number(el.target.value);
    }

    dodajSeEnTag(tag: TagParent) {
        for (let i = 0; i < this.mozniTagi.length; i++) {
            if (this.mozniTagi[i] === tag) {
                const copy: TagParent = new TagParent(null, null, null, null, null, null, null, null, null);
                Object.assign(copy, JSON.parse(JSON.stringify(tag)));
                copy.selectedChild = null;
                this.mozniTagi.splice(i + 1, 0, copy);
                return;
            }
        }
    }

    preveriCeLahkoDodaTag(tag: TagParent): boolean {
        if (tag.checkbox || tag.input) {
            return false;
        }
        return true;
    }

    preveriCeLahkoOdstraniTag(tag: TagParent): boolean {
        let stTagovTeVrste = 0;
        for (let i = 0; i < this.mozniTagi.length; i++) {
            if (this.mozniTagi[i].tagId === tag.tagId) {
                stTagovTeVrste++;
            }
        }
        return stTagovTeVrste > 1;
    }

    odstraniTag(tag: TagParent) {
        const index = this.mozniTagi.indexOf(tag);
        if (index > -1) {
            this.mozniTagi.splice(index, 1);
        }
    }

    shraniVnose() {
        this.oznacevanjeService.shraniIzpolnjeneTage(this.potDoSlike, this.mozniTagi, this.mozniTagiSamoId).then(
            () => {

            }, (err) => {
                console.log(err);
            }
        );
    }

    pretvoriTageVLepObjekt(tagi: Tag[]): Promise<any> {
        return new Promise(resolve => {
            const tagiCopy: Tag[] = JSON.parse(JSON.stringify(tagi));
            this.mozniTagi = [];

            tagi = JSON.parse(JSON.stringify(tagiCopy));
            let stIzbrisanih = 0;
            for (let i = 0; i < tagi.length; i++) {
                if (tagi[i].parentTagId === null) {
                    this.mozniTagi.push(new TagParent(tagi[i].tagId, tagi[i].name, [], tagi[i].input, tagi[i].checkbox,
                        null, null, null, null));
                    this.mozniTagiSamoId.add(tagi[i].tagId);
                    this.vstavljenih++;
                    tagiCopy.splice(i - stIzbrisanih, 1);
                    this.bul = false;
                    stIzbrisanih++;

                } else {
                    if (this.dodajStarsuCeObstaja(this.mozniTagi, tagi[i])) {
                        tagiCopy.splice(i - stIzbrisanih, 1);
                        this.bul = false;
                        stIzbrisanih++;
                    } else if (this.bul) {
                        tagiCopy.splice(i - stIzbrisanih, 1);
                        this.bul = false;
                        stIzbrisanih++;
                    }
                }
            }
            resolve();
        });
    }

    dodajStarsuCeObstaja(lepiTagi: TagParent[], tag: Tag): boolean {
        if (lepiTagi === undefined) {
            return false;
        }
        for (let i = 0; i < lepiTagi.length; i++) {
            if (lepiTagi[i].tagId === tag.parentTagId.tagId) {
                this.vstaviVMozneTage(lepiTagi[i], tag);
                return true;
            }
            if (lepiTagi[i].childTags.length > 0) {
                this.dodajStarsuCeObstaja(lepiTagi[i].childTags, tag);
            }
        }
        return false;
    }

    vstaviVMozneTage(parent: TagParent, child: Tag) {
        for (let i = 0; i < this.mozniTagi.length; i++) {
            if (this.mozniTagi[i].tagId === parent.tagId) {
                this.mozniTagi[i].childTags.push(new TagParent(child.tagId, child.name, [], child.input, child.checkbox,
                    null, null, null, null));
                this.mozniTagiSamoId.add(child.tagId);
                this.bul = true;
                this.vstavljenih++;
                return;
            }
            for (let j = 0; j < this.mozniTagi[i].childTags.length; j++) {
                if (this.mozniTagi[i].childTags[j].tagId === parent.tagId) {
                    this.mozniTagi[i].childTags[j].childTags.push(new TagParent(child.tagId, child.name, [], child.input,
                        child.checkbox, null, null, null, null));
                    this.mozniTagiSamoId.add(child.tagId);
                    this.bul = true;
                    this.vstavljenih++;
                    return;
                }
                for (let k = 0; k < this.mozniTagi[i].childTags[j].childTags.length; k++) {
                    if (this.mozniTagi[i].childTags[j].childTags[k].tagId === parent.tagId) {
                        this.mozniTagi[i].childTags[j].childTags[k].childTags.push(new TagParent(child.tagId, child.name, [],
                            child.input, child.checkbox, null, null, null, null));
                        this.mozniTagiSamoId.add(child.tagId);
                        this.bul = true;
                        this.vstavljenih++;
                        return;
                    }
                }
            }
        }
    }


    // zelo bolj optimalno ampak nisem pršu do končne rešitve

//     pretvoriTageVLepObjekt(tagi: Tag[]) {
//         let tagiCopy: Tag[] = JSON.parse(JSON.stringify(tagi));
//         let lepiTagi: TagParent[] = [];
//
//         while (true) {
//             tagi = JSON.parse(JSON.stringify(tagiCopy));
//             let stIzbrisanih = 0;
//             for (let i = 0; i < tagi.length; i++) {
//                 if (tagi[i].parentTagId === null) {
//                     lepiTagi.push(new TagParent(tagi[i].tagId, tagi[i].name, [], tagi[i].input));
//                     tagiCopy.splice(i - stIzbrisanih, 1);
//                     stIzbrisanih++;
//
//                 } else {
//                     const odgovor: MyTuple = this.dodajStarsuCeObstaja(lepiTagi, tagi[i]);
//                     lepiTagi = odgovor.tabela;
//                     if (odgovor.dodal) {
//                         tagiCopy.splice(i - stIzbrisanih, 1);
//                         stIzbrisanih++;
//                     }
//                 }
//             }
//
//             if (tagiCopy.length === 0) {
//                 return;
//             }
//         }
//         console.log(lepiTagi);
//     }
//
//     dodajStarsuCeObstaja(lepiTagi: TagParent[], tag: Tag): MyTuple {
//         if (lepiTagi === undefined) {
//             return {tabela: lepiTagi, dodal: false};
//         }
//         for (let i = 0; i < lepiTagi.length; i++) {
//             if (lepiTagi[i].tagId === tag.parentTagId.tagId) {
//                 lepiTagi[i].childTags.push(new TagParent(tag.tagId, tag.name, [], tag.input));
//                 return {tabela: lepiTagi, dodal: true};
//             }
//
//             const odgovor: MyTuple = this.dodajStarsuCeObstaja(lepiTagi[i].childTags, tag);
//             if (odgovor.dodal) {
//                 return odgovor;
//             }
//         }
//         return {tabela: lepiTagi, dodal: false};
//     }
// }
//
// class MyTuple {
//     public tabela: TagParent[];
//     public dodal: boolean;
//
//     constructor(tabela: TagParent[], dodal: boolean) {
//         this.tabela = tabela;
//         this.dodal = dodal;
//     }
}
