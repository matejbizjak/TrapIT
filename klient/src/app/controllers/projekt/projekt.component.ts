import {Component, OnInit, TemplateRef} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {ProjektService} from "../../services/projekt/projekt.service";
import {Router} from "@angular/router";
import {Tag} from "../../models/entities/tag.entity";
import {Media} from "../../models/entities/media.entity";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {TagParent} from "../../models/entities/custom/tag-parent";
import {TagZInputValue} from "../../models/entities/custom/tag-z-input-value";
import {FiltriranjeNastavitve} from "../../models/entities/custom/filtriranje-nastavitve";
import {SfiltriraniPodatki} from "../../models/responses/sfiltrirani-podatki";

@Component({
    selector: "app-projekt",
    templateUrl: "./projekt.component.html",
    styleUrls: ["./projekt.component.css"]
})
export class ProjektComponent implements OnInit {
    modalRef: BsModalRef;
    projectId: number;

    mozniTagi: TagParent[];
    mozniTagiCopy: TagParent[];
    mozniTagiSamoId: Set<number>;

    izbranMedia: Media;
    medijiSeznam: Media[];

    // filtracija
    filtriranjeNastavitve: FiltriranjeNastavitve;
    stVsehZadetkov: number;
    specificMediaId: number = null;
    mediaPerPage: number = 25;

    loading = false;

    // stupid
    vstavljenih = 0;
    bul = false;

    constructor(private router: Router, private modalService: BsModalService, private translate: TranslateService,
                private projektService: ProjektService) {
    }

    ngOnInit(): void {
        this.projectId = parseInt(this.router.url.split("/")[2], 10);

        this.filtriranjeNastavitve = new FiltriranjeNastavitve(this.mediaPerPage, 1, "mediaId", true);

        this.mozniTagiSamoId = new Set();
        this.dobiMozneTage().then(() => {
            // this.nastaviCheckboxeNaFalse();
        });

        this.izbranMedia = null;
        this.medijiSeznam = [];
    }

    dobiMozneTage(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.projektService.dobiMozneTage(this.projectId).subscribe(
                (mozniTagi: Tag[]) => {
                    this.pretvoriTageVLepObjekt(mozniTagi["mozniTagi"]).then(
                        () => {
                            this.mozniTagiCopy = [];
                            Object.assign(this.mozniTagiCopy, JSON.parse(JSON.stringify(this.mozniTagi)));
                            resolve();
                        }
                    );
                }, (err) => {
                    console.log(err);
                    reject();
                }
            );
        });
    }

    // nastaviCheckboxeNaFalse() {
    //     for (const tag1 of this.mozniTagi) {
    //         if (tag1.checkbox) {
    //             let falseChild: TagParent;
    //             for (const childTag of tag1.childTags) {
    //                 if (childTag.name === "false") {
    //                     falseChild = childTag;
    //                 }
    //             }
    //             tag1.selectedChild = falseChild;
    //         }
    //     }
    // }

    filtrirajPrikaz(resetSort) {
        this.loading = true;
        this.filtriranjeNastavitve.stNaStran = this.mediaPerPage;
        if (resetSort) {
            this.filtriranjeNastavitve.filtrirajPo = "mediaId";
            this.filtriranjeNastavitve.filtrirajAsc = true;
            this.filtriranjeNastavitve.stStrani = 1;
        }
        this.projektService.pretovriVOblikoZaPosiljatFiltriranje(this.mozniTagi).then(
            (tagi: TagZInputValue[]) => {
                this.projektService.filtrirajSlike(tagi, this.filtriranjeNastavitve, this.specificMediaId).subscribe(
                    (sfiltriraniPodatki: SfiltriraniPodatki) => {
                        console.log(sfiltriraniPodatki);
                        this.medijiSeznam = sfiltriraniPodatki.mediji;
                        this.stVsehZadetkov = sfiltriraniPodatki.stVsehMedijev;
                        this.loading = false;
                        this.specificMediaId = null;
                    }, (err) => {
                    }
                );
            }
        );
    }

    sortClick(e) {
        const clickedName = e.target.attributes.value.value;
        if (this.filtriranjeNastavitve.filtrirajPo === clickedName) {
            this.filtriranjeNastavitve.filtrirajAsc = !this.filtriranjeNastavitve.filtrirajAsc;
        } else {
            this.filtriranjeNastavitve.filtrirajPo = clickedName;
            this.filtriranjeNastavitve.filtrirajAsc = true;
        }
        this.filtrirajPrikaz(false);
    }

    paginationClick(p) {
        this.filtriranjeNastavitve.stStrani = p.page;
        this.filtrirajPrikaz(false);
    }

    odpriOznacevanje(template: TemplateRef<any>, izbranMedia: Media) {
        this.izbranMedia = izbranMedia;
        this.modalRef = this.modalService.show(template, {class: "modal-lg"});
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

    deluje() {
        console.log("deluje");
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

    public vstaviVMozneTage(parent: TagParent, child: Tag) {
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
}
