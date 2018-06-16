import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";

import {OgrodjeComponent} from "./ogrodje/ogrodje.component";
import {AppRoutingModule} from ".//app-routing.module";
import {HttpClientModule} from "@angular/common/http";
import {PrijavaComponent} from "./controllers/prijava/prijava.component";

@NgModule({
  declarations: [
    OgrodjeComponent,
    PrijavaComponent
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
