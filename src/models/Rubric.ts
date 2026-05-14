import { Criterion } from './Criterion';
import { Grade } from './Grade';
import { Evaluation } from './Evaluation';

export interface Rubric {
  id?: string;

  title?: string;
  description?: string;
  is_public?: boolean;
  is_archived?: boolean;

  created_at?: string;
  updated_at?: string;

  criteria?: Criterion[];
  grades?: Grade[];
  evaluations?: Evaluation[];
}
