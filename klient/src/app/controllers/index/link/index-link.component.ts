import {Component, Input} from "@angular/core";
import {Router} from "@angular/router";

@Component({
    selector: "app-index-link",
    templateUrl: "index-link.component.html",
    styleUrls: ["index-link.component.css"]
})
export class IndexLinkComponent {
    @Input() link: string;
    @Input() tekst: string;

    constructor(private router: Router) {

    }

    navigiraj(link: string) {
        // noinspection JSIgnoredPromiseFromCall
        this.router.navigate([link]);
    }

}
