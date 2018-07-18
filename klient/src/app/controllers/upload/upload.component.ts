import { Component, OnInit} from '@angular/core';
import { Folder } from '../../models/entities/folder.entity';
import {UploadService} from "../../services/upload/upload.service";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  folders: Folder;

  constructor(private uploadService: UploadService) { }

  ngOnInit() {
      this.getFolders();
  }

  getFolders(): void{
      this.uploadService.getFolders().subscribe(folders => this.folders = folders);
  }
}
