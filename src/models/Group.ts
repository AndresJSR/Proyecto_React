import { Teacher } from "./Teacher";

export interface Gruop {
  id?: string;
  teacher_id?: string;
  subject_id?: string;
  semester_id?: string;
  name?: string;
  group_code?: string;
  capacity?: number;

  teacher?: Teacher;
  subject?: string;
  semester?: string;
  enrollments?: string;
  evaluations?: string;
}