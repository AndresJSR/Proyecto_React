import { Registration } from './Registration';
import { StudyPlan } from './StudyPlan';

export interface Career {
  id?: string;

  name?: string;
  code?: string;
  description?: string;
  is_active?: boolean;

  created_at?: string;
  updated_at?: string;

  registrations?: Registration[];
  study_plans?: StudyPlan[];
}
