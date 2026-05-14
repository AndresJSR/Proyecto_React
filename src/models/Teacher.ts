import { User } from "./User";

export interface Teacher {
  id?:string;
  user_id?:string;
  first_name?:string;
  last_name?:string;
  phone?:string;
  identification?:string;
  specialty?:string;

  user?:User;
  groups?:Group;
}