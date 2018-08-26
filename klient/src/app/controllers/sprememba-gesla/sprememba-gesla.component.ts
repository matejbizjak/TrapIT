import { Component, OnInit } from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../../services/language.service";
import {AuthService} from "../../services/avtentikacija/auth.service";
import {HttpErrorResponse} from "../../../../node_modules/@angular/common/http";

@Component({
  selector: "app-sprememba-gesla",
  templateUrl: "./sprememba-gesla.component.html",
  styleUrls: ["./sprememba-gesla.component.css"]
})
export class SpremembaGeslaComponent implements OnInit {

  constructor(private translate: TranslateService, private languageService: LanguageService, private authService: AuthService) {
      this.translate.setDefaultLang("slo");
      this.languageService.dobiTrenutniJezik().then(lang => {
          this.translate.use(lang);
      });
  }

  public oldPswrd: string;
  public newPswrd: string;
  public confPswrd: string;
  public error: string;
  public success: boolean;

  spremeniGeslo() {
    if (this.oldPswrd && this.newPswrd && this.confPswrd) {
      this.authService.spremeniGeslo(this.oldPswrd, this.newPswrd, this.confPswrd).then(() => {
        this.success = true;
      }, (err: HttpErrorResponse) => {
          this.success = false;
          switch (err.status) {
              case 401:
                  this.error = "NAPACNI_PODATKI";
                  break;
              case 200:
                  this.error = null;
                  this.success = true;
                  break;
              default:
                  this.error = "NAPAKA_SERVER";
                  break;
          }
      });
    } else {
      this.error = "VSI_PODATKI";
    }
  }

  ngOnInit() {
    this.error = null;
    this.success = false;
  }

}
