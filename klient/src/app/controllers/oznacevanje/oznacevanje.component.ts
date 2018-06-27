import {Component, OnInit} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {SharingService} from "../../services/sharing.service";
import {PotiSlik} from "../../models/entities/poti-slik.entity";
import {ProjektService} from "../../services/projekt/projekt.service";
import {OznacevanjeService} from "../../services/oznacevanje/oznacevanje.service";

@Component({
    selector: "app-oznacevanje",
    templateUrl: "./oznacevanje.component.html"
})
export class OznacevanjeComponent implements OnInit {
    potDoMapeSlik: string;
    vseSlike: string[];
    stVsehSlikVMapi: number;
    potiSlik: PotiSlik;
    zapStSlike: number;

    constructor(private translate: TranslateService, private sharingService: SharingService, private projektService: ProjektService,
                private oznacevanjeService: OznacevanjeService) {
    }

    ngOnInit(): void {
        this.potDoMapeSlik = this.sharingService.getItem("potDoMapeSlik");
        this.zapStSlike = 0;
        this.dobiVseSlike();
        this.potiSlik = null;
    }

    dobiVseSlike() { // dobi imena vseh slik v tej mapi
        this.projektService.dobiDatoteke(this.potDoMapeSlik).subscribe(
            (slike) => {
                this.vseSlike = slike["files"];
                this.stVsehSlikVMapi = this.vseSlike.length;
            }, (err) => {
                console.log(err);
            }
        );
    }

    prejsnjaSlika() {

    }

    naslednjaSlika() {

    }

}
