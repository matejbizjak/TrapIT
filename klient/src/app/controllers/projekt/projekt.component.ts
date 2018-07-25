import {Component, OnInit} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {ProjektService} from "../../services/projekt/projekt.service";
import {SharingService} from "../../services/sharing.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: "app-projekt",
    templateUrl: "./projekt.component.html"
})
export class ProjektComponent implements OnInit {
    pot: string;
    globina: number;
    files: string[];

    public projektID: number;

    constructor(private router: Router, private translate: TranslateService, private projektService: ProjektService,
                private sharingService: SharingService, private activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.pot = "/";
        this.globina = 0;
        this.dobiDatoteke();

        this.projektID = parseInt(this.router.url.split("/")[2], 10);
    }

    dobiDatoteke() {
        this.projektService.dobiDatoteke(this.pot).subscribe(
            (files) => {
                this.files = files["files"];
            }, (err) => {
                console.log(err);
            }
        );
    }

    izberiMapo(datoteka: string) {
        this.sharingService.saveItem("potDoMapeSlik", this.pot + datoteka + "/");
        this.router.navigate(["/oznacevanje/" + this.projektID]);
    }

    naprejVMapo(datoteka: string) {
        if (this.globina < 2) {
            this.pot += datoteka + "/";
            this.dobiDatoteke();
            this.globina++;
        }
    }

    potNazaj() {
        if (this.pot !== "/") {
            const split: string[] = this.pot.split("/");
            const splitLen = split.length;
            this.pot = "";
            for (let i = 0; i < splitLen - 2; i++) {
                this.pot += split[i];
                this.pot += "/";
            }
            this.globina--;
            this.dobiDatoteke();
        }
    }

}
