import { Evaluation } from '../models/Evaluation';
import { Rubric } from '../models/Rubric';
import { Subject } from '../models/Subject';

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

export async function getEvaluations(): Promise<Evaluation[]> {
  return requestJson<Evaluation[]>('/api/evaluation/evaluations', {
    method: 'GET',
  });
}

export async function getPublishedRubrics(): Promise<Rubric[]> {
  const rubrics = await requestJson<Rubric[]>('/api/evaluation/rubrics', {
    method: 'GET',
  });

  return rubrics.filter((rubric) => rubric.is_public === true);
}

export async function getSubjects(): Promise<Subject[]> {
  return requestJson<Subject[]>('/api/academic/subjects', {
    method: 'GET',
  });
}

export async function associateRubric(
  evaluationId: string,
  rubricId: string
): Promise<Evaluation> {
  return requestJson<Evaluation>(
    `/api/evaluation/evaluations/${evaluationId}/associate-rubric/${rubricId}`,
    {
      method: 'PATCH',
    }
  );
}