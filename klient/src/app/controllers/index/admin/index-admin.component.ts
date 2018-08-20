import {Component, OnInit} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../../../services/language.service";

@Component({
    selector: "app-index-admin-component",
    templateUrl: "index-admin.component.html"
})
export class IndexAdminComponent implements OnInit {

    constructor(private translate: TranslateService, private languageService: LanguageService) {
        this.translate.setDefaultLang("slo");
        this.languageService.dobiTrenutniJezik().then(lang => {
            this.translate.use(lang);
        });
    }

    ngOnInit(): void {

    }

}
