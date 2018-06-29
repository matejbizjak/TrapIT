import {Component, OnInit} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {SharingService} from "../../services/sharing.service";
import {ProjektService} from "../../services/projekt/projekt.service";
import {OznacevanjeService} from "../../services/oznacevanje/oznacevanje.service";
import {Router} from "@angular/router";
import {Tag} from "../../models/entities/tag.entity";
import {TagParent} from "../../models/entities/custom/tag-parent.entity";
import {MediaTag} from "../../models/entities/media-tag.entity";

@Component({
    selector: "app-oznacevanje",
    templateUrl: "./oznacevanje.component.html"
})
export class OznacevanjeComponent implements OnInit {
    potDoMapeSlik: string;
    vseSlike: string[];
    stVsehSlikVMapi: number;
    zapStSlike: number;
    potDoSlike: string;
    projectId: number; // TODO dovoli samo tage, ki so definirani za ta projekt
    mozniTagi: TagParent[];

    // stupid
    vstavljenih = 0;
    bul = false;

    constructor(private translate: TranslateService, private sharingService: SharingService, private projektService: ProjektService,
                private oznacevanjeService: OznacevanjeService, private router: Router) {
    }

    ngOnInit(): void {
        this.potDoMapeSlik = this.sharingService.getItem("potDoMapeSlik");
        if (this.potDoMapeSlik === null) {
            this.router.navigate(["/projekt"]);
        }

        this.zapStSlike = 0;

        this.dobiVseSlike().then(
            () => {
                this.nastaviPoDoSlike();
            }, (err) => {
                console.log(err);
            });

        this.dobiMozneTage();
        this.dobiTage();
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

    dobiMozneTage() {
        this.projektService.dobiMozneTage(null).subscribe(
            (mozniTagi: Tag[]) => {
                this.pretvoriTageVLepObjekt(mozniTagi["mozniTagi"]);
            }, (err) => {
                console.log(err);
            }
        );
    }

    prejsnjaSlika() {
        if (this.zapStSlike !== 0) {
            this.zapStSlike--;
            this.nastaviPoDoSlike();
            this.dobiTage();
        }
    }

    naslednjaSlika() {
        if (this.zapStSlike !== this.stVsehSlikVMapi - 1) {
            this.zapStSlike++;
            this.nastaviPoDoSlike();
            this.dobiTage();
        }
    }

    dobiTage() {
        this.oznacevanjeService.dobiTage(this.potDoSlike).subscribe(
            (tagi: MediaTag[]) => {
                console.log(tagi);
            }, err => {
                console.log(err);
            }
        );
    }

    pretvoriTageVLepObjekt(tagi: Tag[]) {
        const tagiCopy: Tag[] = JSON.parse(JSON.stringify(tagi));
        this.mozniTagi = [];

        tagi = JSON.parse(JSON.stringify(tagiCopy));
        let stIzbrisanih = 0;
        for (let i = 0; i < tagi.length; i++) {
            if (tagi[i].parentTagId === null) {
                this.mozniTagi.push(new TagParent(tagi[i].tagId, tagi[i].name, [], tagi[i].input));
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
    }

    dodajStarsuCeObstaja(lepiTagi: TagParent[], tag: Tag): boolean {
        if (lepiTagi === undefined) {
            return false;
        }
        for (let i = 0; i < lepiTagi.length; i++) {
            if (lepiTagi[i].tagId === tag.parentTagId.tagId) {
                this.vstaviVMozneTage(lepiTagi[i], tag);
                // this.mozniTagi[i].childTags.push(new TagParent(tag.tagId, tag.name, [], tag.input));
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
                this.mozniTagi[i].childTags.push(new TagParent(child.tagId, child.name, [], child.input));
                this.bul = true;
                this.vstavljenih++;
                return;
            }
            for (let j = 0; j < this.mozniTagi[i].childTags.length; j++) {
                if (this.mozniTagi[i].childTags[j].tagId === parent.tagId) {
                    this.mozniTagi[i].childTags[j].childTags.push(new TagParent(child.tagId, child.name, [], child.input));
                    this.bul = true;
                    this.vstavljenih++;
                    return;
                }
                for (let k = 0; k < this.mozniTagi[i].childTags[j].childTags.length; k++) {
                    if (this.mozniTagi[i].childTags[j].childTags[k].tagId === parent.tagId) {
                        this.mozniTagi[i].childTags[j].childTags[k].childTags.push(new TagParent(child.tagId, child.name, [], child.input));
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
