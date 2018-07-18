import { Injectable } from '@angular/core';
import {AuthService} from "../avtentikacija/auth.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {Folder} from "../../models/entities/folder.entity";
import { of} from "rxjs/internal/observable/of";

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient, private auth: AuthService, private folder: Folder) {}


  getFolders(): Observable<Folder>{
      const req = "folders";
      const empty: Folder = new Folder();
      this.http.get(req).subscribe(folders =>
                                    {Object.assign(empty, JSON.stringify(folders));
                                     this.folder = empty;});
      return of(this.folder);
  }
}
