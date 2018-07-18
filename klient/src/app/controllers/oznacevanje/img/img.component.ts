import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-img',
  templateUrl: './img.component.html',
  styleUrls: ['./img.component.css']
})
export class ImgComponent implements OnInit {
  @Input() imgPath: string;
  apiPath: string = "http://localhost:3000/api/slika/slika/";
  constructor() { }

  ngOnInit() {
  }

}
