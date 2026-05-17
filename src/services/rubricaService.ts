import {
  CriterionCreatePayload,
  RubricCreatePayload,
  RubricCriterio,
  Subject,
} from '../types/rubrica';

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

const requestVoid = async (url: string, init: RequestInit): Promise<void> => {
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
};

export async function getSubjects(): Promise<Subject[]> {
  return requestJson<Subject[]>('/api/academic/subjects', {
    method: 'GET',
  });
}

export async function createRubric(
  payload: RubricCreatePayload,
): Promise<{ id: string; title: string; description: string }> {
  return requestJson<{ id: string; title: string; description: string }>(
    '/api/evaluation/rubrics',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );
}

export async function createCriterion(payload: CriterionCreatePayload): Promise<RubricCriterio> {
  return requestJson<RubricCriterio>('/api/evaluation/criteria', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export interface ScaleCreatePayload {
  criterion_id: string;
  name: string;
  description?: string;
  value?: number;
}

export async function createScale(payload: ScaleCreatePayload) {
  return requestJson<any>('/api/evaluation/scales', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function publishRubric(rubricId: string): Promise<void> {
  await requestVoid(`/api/evaluation/rubrics/${rubricId}/publish`, {
    method: 'PATCH',
  });
}

export async function deleteRubrica(id: string | number): Promise<void> {
  await requestVoid(`/api/evaluation/rubrics/${id}/`, {
    method: 'DELETE',
  });
}

export async function archivarRubrica(id: string | number): Promise<void> {
  await requestVoid(`/api/evaluation/rubrics/${id}/archive/`, {
    method: 'POST',
  });
}

export async function getRubricas(): Promise<{ id: string; title: string; description: string; is_public: boolean; is_archived: boolean; created_at: string }[]> {
  return requestJson('/api/evaluation/rubrics', { method: 'GET' });
}

export async function getRubricaById(id: string): Promise<any> {
  return requestJson(`/api/evaluation/rubrics/${id}`, { method: 'GET' });
}