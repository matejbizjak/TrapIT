import {Component, OnInit} from "@angular/core";
import {Projekt, ProjektService} from "../../../services/projekt/projekt.service";
import {PageChangedEvent} from "ngx-bootstrap/pagination";

@Component({
    selector: "app-index-reviewer-component",
    templateUrl: "index-reviewer.component.html"
})
export class IndexReviewerComponent implements OnInit {

    public projekti: Projekt[];
    public prikazaniProjekti: Projekt[];

    constructor(private projektService: ProjektService) {
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

    ngOnInit(): void {
        this.dobiProjekte().then(() => {
            this.prikazaniProjekti = this.projekti.slice(0, 20);
        });
    }

}
