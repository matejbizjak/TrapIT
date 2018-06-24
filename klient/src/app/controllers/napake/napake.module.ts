import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {Napaka403Component} from "./403/napaka403.component";
import {Napaka404Component} from "./404/napaka404.component";
import {RouterModule} from "@angular/router";

@NgModule({
    imports: [
        CommonModule,
        RouterModule
    ],
    declarations: [
        Napaka403Component,
        Napaka404Component
    ]
})
export class NapakeModule {

}
