import {Component, OnInit, Input} from "@angular/core";
import { TagWChild } from "../dodajanje-znacke/dodajanje-znacke.component";

@Component({
  selector: "tag-list-item",
  templateUrl: "./tag-list-item.component.html",
  styleUrls: ["./tag-list-item.component.css"]
})
export class TagListItemComponent implements OnInit {

  @Input() children;

  constructor() { }

  ngOnInit() {
  }

  public addToTag(tag: TagWChild) {
    const newTag: TagWChild = {
      tag: {tagId: null, name: "", checkbox: false, input: false, parentTagId: tag.tag},
        children: null,
    };

    if (tag.children) {
        tag.children.push(newTag);
    } else {
        tag.children = new Array;
        tag.children.push(newTag);
    }
  }

  public removeTag(tag: TagWChild) {
    const index = this.children.indexOf(tag);

    if (index > -1) {
      this.children.splice(index, 1);
    }
  }
}

