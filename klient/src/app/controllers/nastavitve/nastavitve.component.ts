import {Component, OnInit} from "@angular/core";
import {ProjektService, Projekt} from "../../services/projekt/projekt.service";
import {OznacevanjeService} from "../../services/oznacevanje/oznacevanje.service";

@Component({
    selector: "app-nastavitve",
    templateUrl: "./nastavitve.component.html",
    styleUrls: ["./nastavitve.component.css"]
})
export class NastavitveComponent implements OnInit {

    public potDoSlik: string;
    public projekti: Projekt[];
    public izbranProjekt: Projekt;
    public projektName = "Izbira projekta";

    constructor(private projectService: ProjektService, private oznacevanjeService: OznacevanjeService) {

    }

    public printDir() {
        this.projectService.nastaviPot(this.potDoSlik).subscribe();
        this.oznacevanjeService.nastaviPot(this.potDoSlik).subscribe();
    }

    dobiProjekte(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.projectService.dobiProjekte().subscribe(
                (data: Projekt[]) => {
                    this.projekti = data;
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
    }

    ngOnInit() {
        this.dobiProjekte();
    }

}
