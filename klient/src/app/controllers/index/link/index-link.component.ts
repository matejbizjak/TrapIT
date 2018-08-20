import {Component, Input} from "@angular/core";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../../../services/language.service";

@Component({
    selector: "app-index-link",
    templateUrl: "index-link.component.html",
    styleUrls: ["index-link.component.css"]
})
export class IndexLinkComponent {
    @Input() link: string;
    @Input() tekst: string;

    constructor(private router: Router, private translate: TranslateService, private languageService: LanguageService) {
        this.translate.setDefaultLang("slo");
        this.languageService.dobiTrenutniJezik().then(lang => {
            this.translate.use(lang);
        });
    }

    navigiraj(link: string) {
        // noinspection JSIgnoredPromiseFromCall
        this.router.navigate([link]);
    }

}
