import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AlertModule, BsDropdownModule, ModalModule, TimepickerModule, TooltipModule, TypeaheadModule} from "ngx-bootstrap";

@NgModule({
    imports: [
        CommonModule,
        TooltipModule.forRoot(),
        TypeaheadModule.forRoot(),
        AlertModule.forRoot(),
        ModalModule.forRoot(),
        TimepickerModule.forRoot(),
        BsDropdownModule.forRoot()

    ],
    exports: [
        TooltipModule,
        TypeaheadModule,
        ModalModule,
        TimepickerModule,
        AlertModule,
        BsDropdownModule
    ]
})
export class BootstrapModule {
}
