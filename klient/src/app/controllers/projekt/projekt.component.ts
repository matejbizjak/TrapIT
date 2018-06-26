import {Component, OnInit} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: "app-projekt",
    templateUrl: "./projekt.component.html"
})
export class ProjektComponent implements OnInit {

    constructor(private translate: TranslateService) {
    }

    ngOnInit(): void {
    }

}
