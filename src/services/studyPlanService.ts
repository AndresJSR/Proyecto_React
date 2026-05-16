// src/services/studyPlanService.ts

import api from './api'

import {
  StudyPlan,
  CreateStudyPlanDto,
  UpdateStudyPlanDto,
  StudyPlanFilters
} from '../models/StudyPlan'

const BASE_URL = '/academic'

export const studyPlanService = {
  async createStudyPlan(
    payload: CreateStudyPlanDto
  ): Promise<StudyPlan> {
    const response = await api.post(
      `${BASE_URL}/study-plans`,
      payload
    )

    return response.data.data
  },

  async getStudyPlans(): Promise<
    StudyPlan[]
  > {
    const response = await api.get(
      `${BASE_URL}/study-plans`
    )

    return response.data.data
  },

  async getStudyPlanById(
    id: string
  ): Promise<StudyPlan> {
    const response = await api.get(
      `${BASE_URL}/study-plans/${id}`
    )

    return response.data.data
  },

  async updateStudyPlan(
    id: string,
    payload: UpdateStudyPlanDto
  ): Promise<StudyPlan> {
    const response = await api.put(
      `${BASE_URL}/study-plans/${id}`,
      payload
    )

    return response.data.data
  },

  async deleteStudyPlan(
    id: string
  ): Promise<void> {
    await api.delete(
      `${BASE_URL}/study-plans/${id}`
    )
  },

  async searchStudyPlans(
    filters: StudyPlanFilters
  ): Promise<StudyPlan[]> {
    const response = await api.get(
      `${BASE_URL}/study-plans/search`,
      {
        params: filters
      }
    )

    return response.data.data
  }
}