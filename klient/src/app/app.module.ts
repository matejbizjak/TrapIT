import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { OgrodjeComponent } from './ogrodje/ogrodje.component';
import { AppRoutingModule } from './/app-routing.module';
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [
    OgrodjeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [OgrodjeComponent]
})
export class AppModule { }
