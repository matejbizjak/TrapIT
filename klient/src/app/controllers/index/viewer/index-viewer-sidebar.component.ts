import {Component, OnInit} from "@angular/core";

@Component({
    selector: "app-index-viewer-sidebar",
    template: `
    <hr/>

    <li class="nav-item">
        <a class="nav-link" [routerLink]="['/projekt']">Projekt</a>
    </li>
  `
})
export class IndexViewerSidebarComponent implements OnInit {

    constructor() {
    }

    ngOnInit(): void {

    }

}
