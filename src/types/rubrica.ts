export interface Subject {
  id: string;
  name: string;
  code: string;
}

export interface RubricCreatePayload {
  title: string;
  description: string;
}

export interface CriterionCreatePayload {
  rubric_id: string;
  name: string;
  description: string;
  weight: number;
}

export interface RubricCriterio {
  id: string;
  name: string;
  description: string;
  weight: number;
}

export interface RubricFormState {
  subject_id: string;
  title: string;
  description: string;
  criterios: RubricCriterio[];
}
