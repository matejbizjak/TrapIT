import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {OgrodjeComponent} from "./ogrodje/ogrodje.component";
import {AppRoutingModule} from ".//app-routing.module";
import {HttpClientModule} from "@angular/common/http";
import {PrijavaComponent} from "./controllers/prijava/prijava.component";
import {BootstrapModule} from "./bootstrap.module";
import {ServicesModule} from "./services/services.module";
import {IndexModule} from "./controllers/index/index.module";
import {IndexViewerSidebarComponent} from "./controllers/index/viewer/index-viewer-sidebar.component";
import {IndexAdminSidebarComponent} from "./controllers/index/admin/index-admin-sidebar.component";
import {IndexReviewerSidebarComponent} from "./controllers/index/reviewer/index-reviewer-sidebar.component";
import {NapakeModule} from "./controllers/napake/napake.module";

@NgModule({
  declarations: [
    OgrodjeComponent,
    PrijavaComponent,
    IndexAdminSidebarComponent,
    IndexReviewerSidebarComponent,
    IndexViewerSidebarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BootstrapModule,
    // services
    ServicesModule,
    IndexModule,
    NapakeModule
  ],
  providers: [
  ],
  bootstrap: [OgrodjeComponent]
})
export class AppModule {
}
