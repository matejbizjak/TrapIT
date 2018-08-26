import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {OgrodjeComponent} from "./ogrodje/ogrodje.component";
import {AppRoutingModule} from "./app-routing.module";
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
import {AddFolderComponent} from "./controllers/nastavitve/add-folder/add-folder.component";
import {UporabnikiComponent} from "./controllers/uporabniki/uporabniki.component";
import {ImageViewerModule} from "ngx-image-viewer";
import { PathSettingsComponent } from "./controllers/nastavitve/path-settings/path-settings.component";
import {MarkdownModule} from "ngx-markdown";
import {MarkdownService} from "ngx-markdown";


// angular material
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CdkTableModule} from "@angular/cdk/table";
import {CdkTreeModule} from "@angular/cdk/tree";
import {MatSelectModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
} from "@angular/material";

import {ButtonsModule} from "ngx-bootstrap";
import { SpremembaGeslaComponent } from './controllers/sprememba-gesla/sprememba-gesla.component';
import { HomePageInfoEditorComponent } from './controllers/nastavitve/home-page-info-editor/home-page-info-editor.component';
import {LMarkdownEditorModule} from "ngx-markdown-editor";
import { IndexGuestSidebarComponent } from './controllers/index/guest/index-guest-sidebar/index-guest-sidebar.component';
import { GuestComponent } from './controllers/index/guest/guest.component';

const imageViewerSettings = {
    btnClass: "default", // The CSS class(es) that will apply to the buttons
    zoomFactor: 0.25, // The amount that the scale will be increased by
    containerBackgroundColor: "#ccc", // The color to use for the background. This can provided in hex, or rgb(a).
    wheelZoom: true, // If true, the mouse wheel can be used to zoom in
    allowFullscreen: false, // If true, the fullscreen button will be shown, allowing the user to entr fullscreen mode
    allowKeyboardNavigation: false, // If true, the left / right arrow keys can be used for navigation
    btnIcons: { // The icon classes that will apply to the buttons. By default, font-awesome is used.
        zoomIn: "fa fa-plus",
        zoomOut: "fa fa-minus",
        rotateClockwise: "fa fa-repeat",
        rotateCounterClockwise: "fa fa-undo",
        next: "fa fa-arrow-right",
        prev: "fa fa-arrow-left",
        fullscreen: "fa fa-arrows-alt",
    },
    btnShow: {
        zoomIn: true,
        zoomOut: true,
        rotateClockwise: false,
        rotateCounterClockwise: false,
        next: false,
        prev: false
    }
};

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
    declarations: [
        OgrodjeComponent,
        IndexAdminSidebarComponent,
        IndexReviewerSidebarComponent,
        IndexViewerSidebarComponent,
        PrijavaComponent,
        ProjektComponent,
        OznacevanjeComponent,
        NastavitveComponent,
        DodajanjeZnackeComponent,
        TagListItemComponent,
        UrejanjeZnackeComponent,
        AddFolderComponent,
        UporabnikiComponent,
        PathSettingsComponent,
        SpremembaGeslaComponent,
        HomePageInfoEditorComponent,
        IndexGuestSidebarComponent,
        GuestComponent
    ],
    imports: [
        // angular material
        CdkTableModule,
        CdkTreeModule,
        MatAutocompleteModule,
        MatBadgeModule,
        MatBottomSheetModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatStepperModule,
        MatDatepickerModule,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatTreeModule,
        //
        BrowserModule,
        BrowserAnimationsModule,
        LMarkdownEditorModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        MarkdownModule.forRoot(),
        ReactiveFormsModule,
        BootstrapModule,
        ButtonsModule,
        ModalModule.forRoot(),
        PaginationModule.forRoot(),
        PopoverModule.forRoot(),
        ImageViewerModule.forRoot(imageViewerSettings),
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
