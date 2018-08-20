import {Component, OnInit} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../../../services/language.service";

@Component({
    selector: "app-index-admin-sidebar",
    template: `
        <div class="nav-header">
            <span class="nav-frame">
                <a class="nav-item" [routerLink]="['/nastavitve']">{{"OGRODJE.MENU.NASTAVITVE" | translate}}</a>
            </span>
        </div>

        <div class="nav-header">
            <span class="nav-frame">
                <a class="nav-item" [routerLink]="['/uporabniki']">{{"OGRODJE.MENU.UPORABNIKI" | translate}}</a>
            </span>
        </div>
    `,
    styles: [   ".nav-header {height: 100%; float: left; line-height: 60px; font-size: 30px; color: white}" +
                ".nav-frame {float: left; padding-left: 10px; padding-right: 10px; border-right: solid 1px #606060}" +
                ".nav-frame:hover {background-color: #1b1e26}" +
                ".nav-item {text-decoration: none; color: white}"]
})
export class IndexAdminSidebarComponent implements OnInit {

    constructor(public translate: TranslateService, private languageService: LanguageService) {
        this.translate.setDefaultLang("slo");
        this.languageService.dobiTrenutniJezik().then(lang => {
            this.translate.use(lang);
        });
    }

    ngOnInit(): void {

    }

}
