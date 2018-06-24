import {Component, OnInit} from "@angular/core";
import {AuthService} from "../../services/avtentikacija/auth.service";
import {RoleEnum} from "../../models/entities/role.enum";

@Component({
  selector: "app-index-page",
  templateUrl: "index.component.html"
})
export class IndexComponent implements OnInit {
  vloga: string;
  vlogeEnum: any = RoleEnum;

  constructor(private auth: AuthService) {
  }

  ngOnInit(): void {
    const trenutniUporabnik = this.auth.trenutniUporabnik();
    this.vloga = trenutniUporabnik.role_id.role;
  }

}
