import {Vloga} from "./vloga.entity";

export class Uporabnik {
  public id: number;
  public username: string;
  public password: string;
  public roleId: Vloga;
}
