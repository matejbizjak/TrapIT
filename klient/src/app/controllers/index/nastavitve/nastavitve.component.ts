import { Component, OnInit } from "@angular/core";
import { ProjektService, Projekt } from "../../../services/projekt/projekt.service";
import { OznacevanjeService } from "../../../services/oznacevanje/oznacevanje.service";

@Component({
  selector: "app-nastavitve",
  templateUrl: "./nastavitve.component.html",
  styleUrls: ["./nastavitve.component.css"]
})
export class NastavitveComponent implements OnInit {

  public potDoSlik: string;
  public isCollapsed = true;
  public projekti: Projekt[];
  public currProjekt: Projekt;
  public imeProjekta = "Izbor projekta";

  public tagOptionClass = {
    "tag-true": true
  };

  constructor(private projectService: ProjektService, private oznacevanjeService: OznacevanjeService) {

  }

  public updateDir() {
    this.potDoSlik = (<HTMLInputElement>document.getElementById("potID")).value;
    this.projectService.nastaviPot(this.potDoSlik).subscribe();
    this.oznacevanjeService.nastaviPot(this.potDoSlik).subscribe();
  }

  dobiProjekte(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.projectService.dobiProjekte().subscribe(
          (data: Projekt[]) => {
            this.projekti = data;
            resolve();
          },
          (err) => {
            console.log(err);
            reject();
          });
        });
  }

  public setProjekt(proj: Projekt) {
    this.imeProjekta = proj.name;
    this.currProjekt = proj;
  }

  public toggleValue(tag: {name: string, active: boolean}) {
    tag.active = !tag.active;
  }

  ngOnInit() {
    this.dobiProjekte();
  }
}
