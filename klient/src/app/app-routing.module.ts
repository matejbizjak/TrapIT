import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {PrijavaComponent} from "./controllers/prijava/prijava.component";
import {IndexComponent} from "./controllers/index/index.component";
import {PrijavaGuard} from "./services/guards/prijava.guard";
import {Napaka404Component} from "./controllers/napake/404/napaka404.component";
import {Napaka403Component} from "./controllers/napake/403/napaka403.component";
import {ProjektComponent} from "./controllers/projekt/projekt.component";
import {RVguard} from "./services/guards/role.guard";
import {OznacevanjeComponent} from "./controllers/oznacevanje/oznacevanje.component";
import {NastavitveComponent} from "./controllers/nastavitve/nastavitve.component";
import {Projekt2Component} from "./controllers/projekt2/projekt2.component";

const routes: Routes = [
    // routes
    {path: "", component: IndexComponent, canActivate: [PrijavaGuard], pathMatch: "full"},
    {path: "prijava", component: PrijavaComponent},
    {path: "projekt/:id", component: ProjektComponent, canActivate: [RVguard]},
    {path: "projekt2/:id", component: Projekt2Component, canActivate: [RVguard]},
    {path: "oznacevanje/:id", component: OznacevanjeComponent, canActivate: [RVguard]},
    {path: "nastavitve", component: NastavitveComponent},
    // errors
    {path: "404", component: Napaka404Component},
    {path: "403", component: Napaka403Component},
    // wildcard
    {path: "**", redirectTo: "/404"}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
