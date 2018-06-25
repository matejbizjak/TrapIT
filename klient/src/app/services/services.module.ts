import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AuthService} from "./avtentikacija/auth.service";
import {AuthInterceptor} from "./avtentikacija/auth.interceptor";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {UrlInterceptor} from "./url.interceptor";
import {PrijavaGuard} from "./guards/prijava.guard";
import {Aguard, ARguard, AVguard, Rguard, RVguard, Vguard} from "./guards/role.guard";
import {AuthEmitter} from "./emitters/auth.emitter";
import {LanguageService} from "./language.service";

@NgModule({
    imports: [
        CommonModule,
        // HttpClient
    ],
    exports: [],
    providers: [
        // storitve
        AuthService,
        LanguageService,
        // emitters
        AuthEmitter,
        // interceptors
        {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: UrlInterceptor, multi: true},
        // guards
        PrijavaGuard,
        Aguard,
        Rguard,
        Vguard,
        ARguard,
        AVguard,
        RVguard
    ]
})
export class ServicesModule {

}
