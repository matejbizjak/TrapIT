import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {PrijavaComponent} from "./controllers/prijava/prijava.component";
import {IndexComponent} from "./controllers/index/index.component";
import {PrijavaGuard} from "./services/guards/prijava.guard";
import {Napaka404Component} from "./controllers/napake/404/napaka404.component";
import {Napaka403Component} from "./controllers/napake/403/napaka403.component";

const routes: Routes = [
  // routes
  {path: "", component: IndexComponent, canActivate: [PrijavaGuard], pathMatch: "full"},
  {path: "prijava", component: PrijavaComponent},
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
