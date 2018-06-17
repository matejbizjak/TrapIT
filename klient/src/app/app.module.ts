import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";

import {OgrodjeComponent} from "./ogrodje/ogrodje.component";
import {AppRoutingModule} from ".//app-routing.module";
import {HttpClientModule} from "@angular/common/http";
import {PrijavaComponent} from "./controllers/prijava/prijava.component";
import {AuthService} from "./services/avtentikacija/auth.service";

@NgModule({
  declarations: [
    // komponente
    OgrodjeComponent,
    PrijavaComponent,
    // storitve
    AuthService
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [OgrodjeComponent]
})
export class AppModule {
}
