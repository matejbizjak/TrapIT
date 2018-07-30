import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {BsDropdownModule, ModalModule, PaginationModule} from "ngx-bootstrap";

@NgModule({
    imports: [
        CommonModule,
        BsDropdownModule.forRoot(),
        ModalModule.forRoot(),
        PaginationModule.forRoot()
    ],
    exports: [
        BsDropdownModule,
        ModalModule,
        PaginationModule
    ]
})
export class BootstrapModule {
}
