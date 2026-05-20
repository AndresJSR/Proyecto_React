import { StudyPlan } from '../models/StudyPlan'
import { api } from '../interceptors/authInterceptor'

const BASE_URL = '/api/academic'

export interface CreateStudyPlanVersionDto {
  career_id: string
  year: number
  name: string
}

export interface PublishVersionDto {
  version_id: string
  replace_previous?: boolean
}

export const studyPlanVersionService = {
  async getVersionsByCareer(careerId: string): Promise<StudyPlan[]> {
    const response = await api.get(`${BASE_URL}/study-plans/search`, {
      params: { career_id: careerId }
    })
    return response.data.data
  },

  async createVersion(payload: CreateStudyPlanVersionDto): Promise<StudyPlan> {
    const response = await api.post(`${BASE_URL}/study-plans`, payload)
    return response.data.data
  },

  async getVersionById(id: string): Promise<StudyPlan> {
    const response = await api.get(`${BASE_URL}/study-plans/${id}`)
    return response.data.data
  },

  async publishVersion(payload: PublishVersionDto): Promise<StudyPlan> {
    const response = await api.patch(
      `/api/evaluation/rubrics/${payload.version_id}/publish`
    )
    return response.data.data
  }
}