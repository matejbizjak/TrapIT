import {Tag} from "./Tag";

export interface TagWChild {
    tag: Tag;
    children: TagWChild[];
}