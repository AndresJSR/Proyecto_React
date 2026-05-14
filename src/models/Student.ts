import { Registration } from './Registration';
import { User } from './User';

export interface Student {
  id?: string;
  user_id?: string;

  first_name?: string;
  last_name?: string;
  identification?: string;

  created_at?: string;
  updated_at?: string;

  user?: User;

  registrations?: Registration[];
}
