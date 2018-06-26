import {Component, OnInit} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {ProjektService} from "../../services/projekt.service";

@Component({
    selector: "app-projekt",
    templateUrl: "./projekt.component.html"
})
export class ProjektComponent implements OnInit {

    files: string[];

    constructor(private translate: TranslateService, private projektService: ProjektService) {
    }

    ngOnInit(): void {
        this.projektService.dobiDatoteke("/17_Janezova_koca/17_Janezova_koca/").subscribe(
            (files) => {
                // this.files = files;
                console.log(files);
            }, (err) => {
                console.log(err);
            }
        );
    }

}
