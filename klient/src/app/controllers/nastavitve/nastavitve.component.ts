import {Component, OnInit} from "@angular/core";
import {ProjektService} from "../../services/projekt/projekt.service";
import {OznacevanjeService} from "../../services/oznacevanje/oznacevanje.service";

@Component({
    selector: "app-nastavitve",
    templateUrl: "./nastavitve.component.html",
    styleUrls: ["./nastavitve.component.css"]
})
export class NastavitveComponent implements OnInit {

    public potDoSlik: string;
    public navodilaCollapsed = true;

    constructor(private projectService: ProjektService, private oznacevanjeService: OznacevanjeService) {

    }

    public printDir() {
        this.projectService.nastaviPot(this.potDoSlik).subscribe();
        this.oznacevanjeService.nastaviPot(this.potDoSlik).subscribe();
    }

    ngOnInit() {
    }

}
