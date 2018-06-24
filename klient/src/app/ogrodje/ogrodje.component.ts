import {Component, OnInit} from "@angular/core";
import {AuthService} from "../services/avtentikacija/auth.service";
import {User} from "../models/entities/user.entity";
import {Router} from "@angular/router";
import {RoleEnum} from "../models/entities/role.enum";
import {AuthEmitter} from "../services/emitters/auth.emitter";

@Component({
  selector: "app-root",
  templateUrl: "./ogrodje.component.html",
  styleUrls: ["./ogrodje.component.css"]
})
export class OgrodjeComponent implements OnInit {
  subscription;
  jePrijavljen = false;
  trenutniUporabnik: User = new User();
  roleEnum: any = RoleEnum;

  constructor(private authService: AuthService, private router: Router, private emitter: AuthEmitter) {
  }

  ngOnInit(): void {
    this.nastaviPodatke();

    // spremljaj podatke v primeru prijave / odjave
    this.subscription = this.emitter.pridobiSprememboAvtentikacije().subscribe(
      (prijavljen: boolean) => {
        if (prijavljen) {
          this.nastaviPodatke();
        } else {
          this.jePrijavljen = false;
          this.trenutniUporabnik = new User();
        }
      }
    );
  }

  nastaviPodatke() {
    this.jePrijavljen = this.authService.jePrijavljen();
    if (this.jePrijavljen) {
      this.trenutniUporabnik = this.authService.trenutniUporabnik();
    } else {
      this.trenutniUporabnik = new User();
    }
  }

  odjaviUporabnika() {
    this.authService.odjaviUporabnika();
    this.router.navigate(["/prijava"]);
  }
}
