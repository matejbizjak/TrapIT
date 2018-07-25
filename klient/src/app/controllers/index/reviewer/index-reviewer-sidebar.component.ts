import {Component, OnInit} from "@angular/core";

@Component({
    selector: "app-index-reviewer-sidebar",
    template: `
        <hr/>

        <li class="nav-item">
            <a class="nav-link" [routerLink]="['/projekt']">Projekt</a>
        </li>

    `
})
export class IndexReviewerSidebarComponent implements OnInit {

    constructor() {
    }

    ngOnInit(): void {

    }

}
