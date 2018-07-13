import {Component, OnInit, TemplateRef, ErrorHandler} from "@angular/core";
import {ProjektService, Projekt, ProjektTag} from "../../services/projekt/projekt.service";
import {OznacevanjeService} from "../../services/oznacevanje/oznacevanje.service";
import {BsModalService, BsModalRef} from "ngx-bootstrap";
import {PaginationModule, PageChangedEvent} from "ngx-bootstrap/pagination";
import {Tag} from "../../models/entities/tag.entity";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: "app-nastavitve",
    templateUrl: "./nastavitve.component.html",
    styleUrls: ["./nastavitve.component.css"]
})
export class NastavitveComponent implements OnInit, ErrorHandler {

    public potDoSlik: string;
    public projekti: Projekt[];
    public prikazaniProjekti: Projekt[];
    public iskaniProjekti: Projekt[];
    public totalProjects: number;
    public izbranProjekt: Projekt;
    public projektName = "";
    public projektTags: ProjektTag[];
    public korenskiTagi: Tag[];
    public searchTerm: string;

    novProjektRef: BsModalRef;
    odstraniProjektRef: BsModalRef;

    public novProjektIme: string;
    public novProjektTags: ProjektTag[] = [];

    public emptyProjektNameWarning = false;
    public duplicateProjectWarning = false;
    public otherErrorWarning = false;
    public projectCreateSuccess = false;
    public projectDeleteSuccess = false;
    public potSuccess1 = false;
    public potSuccess2 = false;
    public potEmpty = false;

    public noResults = true;

    constructor(private projectService: ProjektService, private oznacevanjeService: OznacevanjeService,
                private modalService: BsModalService) {

    }

    public setDir() {
        this.clearAlerts();
        if (this.potDoSlik) {
            this.projectService.nastaviPot(this.potDoSlik).subscribe((res) => {
                if (res["message"] === "Success") {
                    this.potSuccess1 = true;
                }
            });
            this.oznacevanjeService.nastaviPot(this.potDoSlik).subscribe((res) => {
                if (res["message"] === "Success") {
                    this.potSuccess2 = true;
                }
            });
        } else {
            this.potEmpty = true;
        }
    }

    dobiProjekte(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.projectService.dobiProjekte().subscribe(
                (data: Projekt[]) => {
                    this.projekti = data;
                    this.projekti.sort(this.SortByProjectName);
                    this.projektName = "";

                    this.prikazaniProjekti = this.projekti.slice(0, 20);
                    this.iskaniProjekti = this.projekti;
                    this.totalProjects = this.projekti.length;
                    resolve();
                }, (err) => {
                    console.log(err);
                    reject();
                }
            );
        });
    }

    public nastaviProjekt(proj: Projekt) {
        this.izbranProjekt = proj;
        this.projektName = proj.name;
        this.searchTerm = proj.name;

        this.projectService.dobiTageProjekta(proj.projectId).subscribe((data: ProjektTag[]) => {
            this.projektTags = data;
            this.projektTags.sort(this.SortByTagName);
        });
    }

    public nastaviTage() {
        // Shrani trenutno stanje JSON objekta "izbranProjekt" v podatkovno bazo
        this.projectService.shraniTageProjekta(this.projektTags).subscribe();
    }

    public ustvariNovProjekt(template: TemplateRef<any>) {
        this.clearAlerts();
        this.novProjektRef = this.modalService.show(template);
        this.projectService.dobiKorenskeTage().subscribe((data: Tag[]) => {
            this.korenskiTagi = data;

            this.novProjektTags = new Array;
            data.forEach((element) => {
                this.novProjektTags.push({projectTagId: 0, active: false, tagId: element});
            });

        });
    }

    public izbrisiProjekt() {
        this.projectService.izbrisiProjekt(this.izbranProjekt.projectId).subscribe((data: {message}) => {
            if (data.message === "Success") {
                this.clearAlerts();
                this.projectDeleteSuccess = true;
            } else {
                this.clearAlerts();
                this.otherErrorWarning = true;
            }
            this.dobiProjekte();
        }, error => {
            this.handleError(error);
        });
    }

    public changeBool(projTg: ProjektTag) {
        projTg.active = !projTg.active;
    }

    public clearAlerts() {
        this.emptyProjektNameWarning = false;
        this.duplicateProjectWarning = false;
        this.otherErrorWarning = false;
        this.projectCreateSuccess = false;
        this.projectDeleteSuccess = false;
        this.potSuccess1 = false;
        this.potSuccess2 = false;
        this.potEmpty = false;
    }

    public shraniNovProjekt() {
        if (this.novProjektIme !== "" && this.novProjektIme) {
            this.projectService.shraniNovProjekt(this.novProjektIme, this.novProjektTags).subscribe((data: {message}) => {
                if (data.message === "Success") {
                    this.clearAlerts();
                    this.projectCreateSuccess = true;
                }
                this.dobiProjekte();
            }, error => {
                this.handleError(error);
            });
            this.emptyProjektNameWarning = false;
        } else {
            this.emptyProjektNameWarning = true;
        }
    }

    public SortByProjectName(x, y) {
        return ((x.name === y.name) ? 0 : ((x.name > y.name) ? 1 : -1 ));
    }

    public SortByTagName(x, y) {
        return ((x.tagId.name === y.tagId.name) ? 0 : ((x.tagId.name > y.tagId.name) ? 1 : -1 ));
    }

    public handleError(error: any) {
        const errHttpCode = error.error.err.code;

        switch (errHttpCode) {
            case "ER_DUP_ENTRY":
                this.duplicateProjectWarning = true;
                break;
            default:
                this.otherErrorWarning = true;
        }
    }

    public izbrisiModal(template: TemplateRef<any>) {
        this.clearAlerts();
        this.odstraniProjektRef = this.modalService.show(template);
    }

    public searchProjekt() {
        this.iskaniProjekti = new Array;

        this.projekti.forEach((element) => {
            if (element.name.indexOf(this.searchTerm) >= 0) {
                this.iskaniProjekti.push(element);
            }
        });

        this.prikazaniProjekti = this.iskaniProjekti;
        this.totalProjects = this.iskaniProjekti.length;

        if (this.iskaniProjekti.length === 0) {
            this.noResults = true;
        }
    }

    public pageChanged(event: PageChangedEvent) {
        const startItem = (event.page - 1) * event.itemsPerPage;
        const endItem = event.page * event.itemsPerPage;
        this.prikazaniProjekti = this.iskaniProjekti.slice(startItem, endItem);
    }

    ngOnInit() {
        this.projekti = new Array;
        this.dobiProjekte();
    }
}
