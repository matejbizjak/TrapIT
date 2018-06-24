import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router} from "@angular/router";
import {Observable} from "rxjs";
import {AuthService} from "../avtentikacija/auth.service";

@Injectable()
export class PrijavaGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.auth.jePrijavljen()) {
      return true;
    } else {
      this.router.navigate(["/prijava"]);
    }
    return false;
  }
}
