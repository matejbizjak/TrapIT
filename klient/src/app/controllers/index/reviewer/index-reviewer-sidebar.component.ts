import {Component, OnInit} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../../../services/language.service";

@Component({
    selector: "app-index-reviewer-sidebar",
    template: `
        <div class="nav-header">
            <span class="nav-frame">
                <a class="nav-item" [routerLink]="['/']">{{"OGRODJE.MENU.PROJEKT" | translate}}</a>
            </span>
        </div>
    `,
    styles: [   ".nav-header {height: 60px; float: left; line-height: 60px; font-size: 30px; color: white}" +
                ".nav-frame {float: left; padding-left: 10px; padding-right: 10px}" +
                ".nav-frame:hover {background-color: #1b1e26}" +
                ".nav-item {text-decoration: none; color: white}"]
})
export class IndexReviewerSidebarComponent implements OnInit {

    constructor(private translate: TranslateService, private languageService: LanguageService) {
        this.translate.setDefaultLang("slo");
        this.languageService.dobiTrenutniJezik().then(lang => {
            this.translate.use(lang);
        });
    }

    ngOnInit(): void {

    }

}
