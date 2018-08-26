import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-index-guest-sidebar",
    template: `
        <div class="nav-header">
            <span class="nav-frame">
                <a class="nav-item" [routerLink]="['/info']">{{"OGRODJE.MENU.INFO" | translate}}</a>
            </span>
        </div>
    `,
    styles: [   ".nav-header {height: 60px; float: left; line-height: 60px; font-size: 30px; color: white}" +
    ".nav-frame {float: left; padding-left: 10px; padding-right: 10px; border-right: solid 1px #606060}" +
    ".nav-frame:hover {background-color: #1b1e26}" +
    ".nav-item {text-decoration: none; color: white}"]
})
export class IndexGuestSidebarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
