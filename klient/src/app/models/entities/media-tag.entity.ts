import {User} from "./user.entity";
import {Tag} from "./tag.entity";
import {Media} from "./media.entity";

export class MediaTag {
    public mediaTagId: number;
    public userId: User;
    public tagId: Tag;
    public mediaId: Media;
    inputValue: number;
}
