import { Enrollment } from '../models/Enrollment';
import { Evaluation } from '../models/Evaluation';
import { Grade } from '../models/Grade';
import { Rubric } from '../models/Rubric';
import { Criterion } from '../models/Criterion';
import { Scale } from '../models/Scale';
import { GradePayload } from '../types/rubrica';

const API_BASE_URL = 'http://localhost:5000';

interface ApiResponse<T> {
  data: T;
  message?: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const getErrorMessage = async (response: Response) => {
  try {
    const errorBody = (await response.json()) as { message?: string };
    return errorBody.message || `Request failed with status ${response.status}`;
  } catch {
    return `Request failed with status ${response.status}`;
  }
};

const requestJson = async <T>(url: string, init: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...init,
    headers: {
      ...getAuthHeaders(),
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  const body = (await response.json()) as ApiResponse<T>;
  return body.data;
};

export async function getEnrollmentsByGroup(groupId: string): Promise<Enrollment[]> {
  return requestJson<Enrollment[]>(`/api/evaluation/enrollments?group_id=${encodeURIComponent(groupId)}`, {
    method: 'GET',
  });
}

export async function getEvaluation(evaluationId: string): Promise<Evaluation> {
  return requestJson<Evaluation>(`/api/evaluation/evaluations/${evaluationId}`, {
    method: 'GET',
  });
}

export async function getRubricWithCriteria(rubricId: string): Promise<Rubric> {
  const rubric = await requestJson<Rubric>(`/api/evaluation/rubrics/${rubricId}`, {
    method: 'GET',
  });

  return rubric;
}

export async function getGradeByEnrollmentAndRubric(
  enrollmentId: string,
  rubricId: string
): Promise<Grade | null> {
  const grades = await requestJson<Grade[]>(
    `/api/evaluation/grades?enrollment_id=${encodeURIComponent(enrollmentId)}&rubric_id=${encodeURIComponent(rubricId)}`,
    {
      method: 'GET',
    }
  );

  return grades.length > 0 ? grades[0] : null;
}

export async function saveGrade(payload: GradePayload): Promise<Grade> {
  return requestJson<Grade>('/api/evaluation/grades', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export type { Criterion, Scale };