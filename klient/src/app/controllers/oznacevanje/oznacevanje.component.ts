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

        this.dobiVseSlike().then(
            () => {
                this.nastaviPoDoSlike();
                this.dobiTage();
            }, (err) => {
                console.log(err);
            });

        this.dobiMozneTage();
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
                this.pretvoriTageVLepObjekt(mozniTagi["mozniTagi"]).then(
                    () => {
                        // this.dodajInpute();
                    }
                );
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

    // dodajInpute() {
    //     const formTagi = <HTMLFormElement> document.getElementById("tagi");
    //
    //     // divTagi.innerHTML = "addd";
    //     let html = "";
    //
    //     for (const mozniTag of this.mozniTagi) {
    //         if (mozniTag.childTags.length > 0) {
    //             html += "<label>" + mozniTag.name + "</label>\n" +
    //                 "<select class='form-control form-control-sm' id='" + mozniTag.tagId + "_1" + "' name='" + mozniTag.tagId + "'>";
    //             // html += "<option disabled selected></option>";
    //             for (const childTag of mozniTag.childTags) {
    //                 html += "<option value='" + childTag.tagId + "'>" + childTag.name + "</option>";
    //             }
    //             html += "</select>";
    //
    //             formTagi.innerHTML = html;
    //
    //
    //             // this.elementRef.nativeElement.getElementById(mozniTag.tagId + "_1").addEventListener("click", this.posodobiPolja);
    //             this.elementRef.nativeElement[mozniTag.tagId + "_1"].addEventListener("click", this.posodobiPolja);
    //             // document.getElementById(mozniTag.tagId + "_1").addEventListener("click", this.posodobiPolja);
    //         } else if (mozniTag.childTags.length === 0 && mozniTag.input === true) {
    //             html += "<label>" + mozniTag.name + "</label>\n" +
    //                 "<input type='number' class='form-control form-control-sm' name='" + mozniTag.tagId + "'></input>";
    //             formTagi.innerHTML = html;
    //         }
    //     }
    // }

    // dodajPolja(el, parentTag: TagParent) {
    //     let izbranTag: TagParent;
    //     for (const childTag of parentTag.childTags) {
    //         if (childTag.tagId == el.target.value) {
    //             izbranTag = childTag;
    //         }
    //     }
    //
    //     if (izbranTag.childTags.length > 0) {
    //         console.log(el);
    //         console.log(izbranTag);
    //
    //         const novDiv = document.createElement("div");
    //         let html = "";
    //
    //         html += "<label>" + izbranTag.name + "</label>\n" +
    //             "<select class='form-control form-control-sm' name='" + izbranTag.tagId + "'>";
    //         html += "<option disabled selected></option>";
    //         for (const c of izbranTag.childTags) {
    //             html += "<option value='" + c.tagId + "'>" + c.name + "</option>";
    //         }
    //         html += "</select>";
    //
    //         novDiv.innerHTML = html;
    //
    //         console.log(el);
    //     }
    // }

    jeIzbralNivo(el, parentTag: TagParent) {

        let izbranTag: TagParent;

        if (parentTag.checkbox) {
            for (const childTag of parentTag.childTags) {
                if (el.target.checked && childTag.name === "true") {
                    izbranTag = childTag;
                } else if (el.target.checked === false && childTag.name === "false") {
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

        console.log(this.mozniTagi);
    }

    zapisiSteviloZivali(el, parentTag: TagParent) {
        parentTag.inputValue = Number(el.target.value);
        console.log(this.mozniTagi);
    }

    dodajSeEnTag(tag: TagParent) {
        for (let i = 0; i < this.mozniTagi.length; i++) {
            if (this.mozniTagi[i].tagId === tag.tagId) {
                const copy: TagParent = new TagParent(null, null, null, null, null, null, null);
                Object.assign(copy, JSON.parse(JSON.stringify(tag)));
                this.mozniTagi.splice(i, 0, copy);
                return;
            }
        }
    }

    preveriCeLahkoOdstraniTag(tag: TagParent): boolean {
        let stTagovTeVrste = 0;
        for (let i = 0; i < this.mozniTagi.length; i++) {
            if (this.mozniTagi[i].tagId === tag.tagId) {
                stTagovTeVrste++;
            }
        }
        console.log(stTagovTeVrste);
        return stTagovTeVrste > 1;
    }

    odstraniTag(tag: TagParent) {
        const index = this.mozniTagi.indexOf(tag);
        if (index > -1) {
            this.mozniTagi.splice(index, 1);
        }
    }

    shraniVnose() {
        // const formData = new FormData(<HTMLFormElement> document.getElementById("tagi"));
        // for (const pair of formData.entries()) {
        //     console.log(pair[0] + ", " + pair[1]);
        // }
    }

    pretvoriTageVLepObjekt(tagi: Tag[]): Promise<any> {
        return new Promise(resolve => {
            const tagiCopy: Tag[] = JSON.parse(JSON.stringify(tagi));
            this.mozniTagi = [];

            tagi = JSON.parse(JSON.stringify(tagiCopy));
            let stIzbrisanih = 0;
            for (let i = 0; i < tagi.length; i++) {
                if (tagi[i].parentTagId === null) {
                    this.mozniTagi.push(new TagParent(tagi[i].tagId, tagi[i].name, [], tagi[i].input, tagi[i].checkbox, null, null));
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
            console.log(this.mozniTagi);
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
                this.mozniTagi[i].childTags.push(new TagParent(child.tagId, child.name, [], child.input, child.checkbox, null, null));
                this.bul = true;
                this.vstavljenih++;
                return;
            }
            for (let j = 0; j < this.mozniTagi[i].childTags.length; j++) {
                if (this.mozniTagi[i].childTags[j].tagId === parent.tagId) {
                    this.mozniTagi[i].childTags[j].childTags.push(new TagParent(child.tagId, child.name, [], child.input,
                        child.checkbox, null, null));
                    this.bul = true;
                    this.vstavljenih++;
                    return;
                }
                for (let k = 0; k < this.mozniTagi[i].childTags[j].childTags.length; k++) {
                    if (this.mozniTagi[i].childTags[j].childTags[k].tagId === parent.tagId) {
                        this.mozniTagi[i].childTags[j].childTags[k].childTags.push(new TagParent(child.tagId, child.name, [],
                            child.input, child.checkbox, null, null));
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
