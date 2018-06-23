import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {OgrodjeComponent} from "./ogrodje/ogrodje.component";
import {AppRoutingModule} from ".//app-routing.module";
import {HttpClientModule} from "@angular/common/http";
import {PrijavaComponent} from "./controllers/prijava/prijava.component";
import {AuthService} from "./services/avtentikacija/auth.service";

@NgModule({
  declarations: [
    OgrodjeComponent,
    PrijavaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthService
  ],
  bootstrap: [OgrodjeComponent]
})
export class AppModule {
}
