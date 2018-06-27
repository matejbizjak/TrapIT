import {Component, OnInit} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {SharingService} from "../../services/sharing.service";
import {ProjektService} from "../../services/projekt/projekt.service";
import {OznacevanjeService} from "../../services/oznacevanje/oznacevanje.service";
import {Router} from "@angular/router";
import {Tag} from "@angular/compiler/src/i18n/serializers/xml_helper";

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
    mozniTagi: Tag[];

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
                console.log(mozniTagi);
            }, (err) => {
                console.log(err);
            }
        );
    }

    // dobiSliko() {
    //     this.oznacevanjeService.dobiSliko(this.potDoSlike).subscribe((slika) => {
    //
    //     }, (err) => {
    //
    //     });
    // }

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
            (tagi) => {

            }, err => {
                console.log(err);
            }
        );
    }

}
