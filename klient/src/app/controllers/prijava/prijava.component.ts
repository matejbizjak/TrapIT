import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {AuthService} from "../../services/avtentikacija/auth.service";
import {PrijavaRequest} from "../../models/requests/prijava.request";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: "app-prijava",
  templateUrl: "./prijava.component.html"
})
export class PrijavaComponent implements OnInit {
  prijavaRequest: PrijavaRequest;
  napaka: string;

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.prijavaRequest = new PrijavaRequest();
    this.napaka = null;
  }

  prijaviUporabnika() {
    if (this.prijavaRequest.username && this.prijavaRequest.password) {
      this.authService.prijaviUporabnika(this.prijavaRequest)
        .then(
          () => {
            this.router.navigate(["/"]);
          }, (err: HttpErrorResponse) => {
            switch (err.status) {
              case 401:
                this.napaka = "Napačna email in/ali geslo!";
                break;
              default:
                this.napaka = "Napaka na strežniku! Prijava trenutno ni na voljo";
                break;
            }
          }
        );
    } else {
      this.napaka = "Prosim izpolnite vse podatke!";
      return false;
    }
  }
}
