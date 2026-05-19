import { Evaluation } from '../models/Evaluation';
import { Rubric } from '../models/Rubric';
import { Subject } from '../models/Subject';
import { Group } from '../models/Group';
import { api } from '../interceptors/authInterceptor';

interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface EvaluacionCreatePayload {
  subject_id: string;
  group_id: string;
  name: string;
  description?: string;
  weight: number;
}

export async function getEvaluations(): Promise<Evaluation[]> {
  const response = await api.get<ApiResponse<Evaluation[]>>('/api/evaluation/evaluations');
  return response.data.data;
}

export async function getPublishedRubrics(): Promise<Rubric[]> {
  const response = await api.get<ApiResponse<Rubric[]>>('/api/evaluation/rubrics');
  return (response.data.data ?? []).filter((rubric) => rubric.is_public === true);
}

export async function getSubjects(): Promise<Subject[]> {
  const response = await api.get<ApiResponse<Subject[]>>('/api/academic/subjects');
  return response.data.data;
}

export async function getGroupsByTeacher(teacherId: string): Promise<Group[]> {
  const response = await api.get<ApiResponse<Group[]>>('/api/academic/groups');
  return (response.data.data ?? []).filter((group) => group.teacher_id === teacherId);
}

export async function associateRubric(
  evaluationId: string,
  rubricId: string
): Promise<Evaluation> {
  const response = await api.patch<ApiResponse<Evaluation>>(
    `/api/evaluation/evaluations/${evaluationId}/associate-rubric/${rubricId}`
  );
  return response.data.data;
}

export async function createEvaluation(payload: EvaluacionCreatePayload): Promise<Evaluation> {
  const response = await api.post<ApiResponse<Evaluation>>('/api/evaluation/evaluations', payload);
  return response.data.data;
}