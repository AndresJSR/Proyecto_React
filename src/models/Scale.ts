import { Criterion } from './Criterion';
import { GradeDetail } from './GradeDetail';

export interface Scale {
  id?: string;
  criterion_id?: string;

  name?: string;
  description?: string;
  value?: number;

  created_at?: string;
  updated_at?: string;

  criterion?: Criterion;
  grade_details?: GradeDetail[];
}
