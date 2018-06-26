import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {AuthService} from "../avtentikacija/auth.service";
import {User} from "../../models/entities/user.entity";

// Guardi imajo kodirana imena: A - admin, R - referent, P - profesor, S - student

@Injectable()
export class ARguard implements CanActivate {

    constructor(private router: Router, private auth: AuthService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const trenutniUporabnik: User = this.auth.trenutniUporabnik();
        if (trenutniUporabnik.roleId.role === "admin" || trenutniUporabnik.roleId.role === "reviewer") {
            return true;
        }
        return false;
    }
}

@Injectable()
export class AVguard implements CanActivate {

    constructor(private router: Router, private auth: AuthService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const trenutniUporabnik: User = this.auth.trenutniUporabnik();
        if (trenutniUporabnik.roleId.role === "admin" || trenutniUporabnik.roleId.role === "viewer") {
            return true;
        }
        return false;
    }
}

@Injectable()
export class RVguard implements CanActivate {
    constructor(private router: Router, private auth: AuthService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const trenutniUporabnik: User = this.auth.trenutniUporabnik();
        if (trenutniUporabnik.roleId.role === "reviewer" || trenutniUporabnik.roleId.role === "viewer") {
            return true;
        }
        return false;
    }
}


@Injectable()
export class Aguard implements CanActivate {

    constructor(private router: Router, private auth: AuthService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const trenutniUporabnik: User = this.auth.trenutniUporabnik();
        if (trenutniUporabnik.roleId.role === "admin") {
            return true;
        }
        return false;
    }
}

@Injectable()
export class Rguard implements CanActivate {

    constructor(private router: Router, private auth: AuthService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const trenutniUporabnik: User = this.auth.trenutniUporabnik();
        if (trenutniUporabnik.roleId.role === "reviewer") {
            return true;
        }
        return false;
    }
}

@Injectable()
export class Vguard implements CanActivate {

    constructor(private router: Router, private auth: AuthService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const trenutniUporabnik: User = this.auth.trenutniUporabnik();
        if (trenutniUporabnik.roleId.role === "viewer") {
            return true;
        }
        return false;
    }
}
