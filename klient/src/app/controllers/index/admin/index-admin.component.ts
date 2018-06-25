import {Component, OnInit} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: "app-index-admin-component",
    templateUrl: "index-admin.component.html"
})
export class IndexAdminComponent implements OnInit {

    constructor(private translate: TranslateService) {
    }

    ngOnInit(): void {

    }

}
