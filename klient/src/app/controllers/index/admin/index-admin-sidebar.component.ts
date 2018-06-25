import {Component, OnInit} from "@angular/core";

@Component({
  selector: "app-index-admin-sidebar",
  template: `
    <hr/>

    <li class="nav-item">
      <a class="nav-link" [routerLink]="['/url']">Url</a>
    </li>

    <hr/>
    <li class="nav-item">
      <a class="nav-link" [routerLink]="['/nastavitve']">Nastavitve</a>
    </li>
  `
})
export class IndexAdminSidebarComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {

  }

}
