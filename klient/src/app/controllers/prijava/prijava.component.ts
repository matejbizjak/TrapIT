import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../services/avtentikacija/auth.service";
import {PrijavaRequest} from "../../models/requests/prijava.request";

@Component({
  selector: "app-prijava",
  templateUrl: "./prijava.component.html"
})
export class PrijavaComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });
  }

  prijaviUporabnika() {
    const val = this.form.value;

    if (val.username && val.password) {
      const data: PrijavaRequest = new PrijavaRequest(val.username, val.password);
      this.authService.prijaviUporabnika(data)
        .then(
          () => {
            console.log("User is logged in");
            this.router.navigateByUrl("/");
          }, (err) => {
            console.log("Napaka pri prijavi:", err);
          }
        );
    }
  }

  odjaviUporabnika() {
    this.authService.odjaviUporabnika();
    this.router.navigateByUrl("/prijava");
  }
}
