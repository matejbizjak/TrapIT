import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {OgrodjeComponent} from "./ogrodje/ogrodje.component";
import {AppRoutingModule} from ".//app-routing.module";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {PrijavaComponent} from "./controllers/prijava/prijava.component";
import {BootstrapModule} from "./bootstrap.module";
import {ServicesModule} from "./services/services.module";
import {IndexModule} from "./controllers/index/index.module";
import {IndexViewerSidebarComponent} from "./controllers/index/viewer/index-viewer-sidebar.component";
import {IndexAdminSidebarComponent} from "./controllers/index/admin/index-admin-sidebar.component";
import {IndexReviewerSidebarComponent} from "./controllers/index/reviewer/index-reviewer-sidebar.component";
import {NapakeModule} from "./controllers/napake/napake.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {ProjektComponent} from "./controllers/projekt/projekt.component";
import {OznacevanjeComponent} from "./controllers/oznacevanje/oznacevanje.component";
import {NastavitveComponent} from "./controllers/nastavitve/nastavitve.component";
import {BsModalService, ModalModule, PaginationModule, PopoverModule} from "ngx-bootstrap";
import {DodajanjeZnackeComponent} from "./controllers/dodajanje-znacke/dodajanje-znacke.component";
import {TagListItemComponent} from "./controllers/tag-list-item/tag-list-item.component";
import {UrejanjeZnackeComponent} from "./controllers/urejanje-znacke/urejanje-znacke.component";
import {Projekt2Component} from "./controllers/projekt2/projekt2.component";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
    declarations: [
        OgrodjeComponent,
        IndexAdminSidebarComponent,
        IndexReviewerSidebarComponent,
        IndexViewerSidebarComponent,
        PrijavaComponent,
        ProjektComponent,
        Projekt2Component,
        OznacevanjeComponent,
        NastavitveComponent,
        DodajanjeZnackeComponent,
        TagListItemComponent,
        UrejanjeZnackeComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        BootstrapModule,
        ModalModule.forRoot(),
        PaginationModule.forRoot(),
        PopoverModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        // services
        ServicesModule,
        IndexModule,
        NapakeModule,
    ],
    providers: [
        BsModalService,
        PaginationModule],
    bootstrap: [OgrodjeComponent]
})
export class AppModule {
}
