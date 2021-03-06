import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {Projekt, ProjektService} from "../../../services/projekt/projekt.service";
import {PageChangedEvent} from "ngx-bootstrap/pagination";
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../../../services/language.service";

@Component({
    selector: "app-index-choose-project",
    templateUrl: "./choose-project.component.html",
    styleUrls: ["./choose-project.component.css"]
})
export class ChooseProjectComponent implements OnInit {

    public projekti: Projekt[];
    public prikazaniProjekti: Projekt[];

    constructor(private projektService: ProjektService, private router: Router, private translate: TranslateService,
                private languageService: LanguageService) {
        this.translate.setDefaultLang("slo");
        this.languageService.dobiTrenutniJezik().then(lang => {
            this.translate.use(lang);
        });
    }

    dobiProjekte(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.projektService.dobiProjekte().subscribe(
                (data: Projekt[]) => {
                    this.projekti = data;
                    this.projekti.sort(this.SortByProjectName);
                    resolve();
                }, (err) => {
                    console.log(err);
                    reject();
                }
            );
        });
    }

    public SortByProjectName(x, y) {
        return ((x.name === y.name) ? 0 : ((x.name > y.name) ? 1 : -1));
    }

    public pageChanged(event: PageChangedEvent) {
        const startItem = (event.page - 1) * event.itemsPerPage;
        const endItem = event.page * event.itemsPerPage;
        this.prikazaniProjekti = this.projekti.slice(startItem, endItem);
    }

    public goTo(projID: number) {
        this.router.navigate(["/projekt/" + projID]);
    }

    ngOnInit(): void {
        this.dobiProjekte().then(() => {
            this.prikazaniProjekti = this.projekti.slice(0, 20);
        });
    }

}
