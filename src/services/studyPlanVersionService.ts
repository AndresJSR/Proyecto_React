import { CreateStudyPlanVersionDto, PublishVersionDto, StudyPlanVersion } from '../models/StudyPlanVersion'
import api from './api'

const BASE_URL = '/academic'

export const studyPlanVersionService = {
  async getVersionsByCareer(careerId: string): Promise<StudyPlanVersion[]> {
    const response = await api.get(`${BASE_URL}/study-plan-versions`, { params: { career_id: careerId } })
    return response.data.data
  },

  async createVersion(payload: CreateStudyPlanVersionDto): Promise<StudyPlanVersion> {
    const response = await api.post(`${BASE_URL}/study-plan-versions`, payload)
    return response.data.data
  },

  async getVersionById(id: string): Promise<StudyPlanVersion> {
    const response = await api.get(`${BASE_URL}/study-plan-versions/${id}`)
    return response.data.data
  },

  async publishVersion(id: string, payload: PublishVersionDto): Promise<StudyPlanVersion> {
    const response = await api.post(`${BASE_URL}/study-plan-versions/${id}/publish`, payload)
    return response.data.data
  }
}
