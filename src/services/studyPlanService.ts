import { api } from '../interceptors/authInterceptor'

import { Career } from '../models/Career'
import { StudyPlan } from '../models/StudyPlan'
import { Subject } from '../models/Subject'

import {
  AddSubjectToStudyPlanPayload,
  StudyPlanSubject
} from '../types/studyPlan'

type StudyPlanPayload = Omit<StudyPlan, 'id' | 'is_published'>

const BASE_URL = '/api/academic'

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return 'Error al ejecutar la operación de plan de estudios'
}

export const studyPlanService = {
  async getStudyPlans(): Promise<StudyPlan[]> {
    try {
      const response = await api.get(`${BASE_URL}/study-plans`)

      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async getStudyPlanById(id: number): Promise<StudyPlan> {
    try {
      const response = await api.get(`${BASE_URL}/study-plans/${id}`)

      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async getStudyPlansByCareer(careerId: number): Promise<StudyPlan[]> {
    try {
      const response = await api.get(`${BASE_URL}/study-plans/search`, {
        params: {
          career_id: careerId
        }
      })

      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async createStudyPlan(
    payload: StudyPlanPayload
  ): Promise<StudyPlan> {
    try {
      const response = await api.post(`${BASE_URL}/study-plans`, {
        career_id: payload.career_id,
        name: payload.name,
        year: payload.year,
        suggested_semester: payload.suggested_semester
      })

      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

    async getSubjectsByStudyPlan(
      studyPlanId: string | number
    ): Promise<StudyPlanSubject[]> {
      try {
        const response = await api.get(
          `${BASE_URL}/study-plans/${studyPlanId}/subjects`
        )
      const raw = response.data.data

      // Normaliza la respuesta del API al tipo StudyPlanSubject
      return (raw ?? []).map((item: any): StudyPlanSubject => ({
        subject_id:         item.subject_id         ?? item.id               ?? 0,
        subject_name:       item.subject_name        ?? item.subject?.name    ?? item.name  ?? '',
        subject_code:       item.subject_code        ?? item.subject?.code    ?? item.code  ?? '',
        credits:            item.credits             ?? item.subject?.credits ?? 0,
        suggested_semester: item.suggested_semester  ?? 0
      }))
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async addSubjectToStudyPlan(
    studyPlanId: number,
    subjectId: number,
    payload: AddSubjectToStudyPlanPayload
  ): Promise<void> {
    try {
      const response = await api.post(
        `${BASE_URL}/study-plans/${studyPlanId}/subjects/${subjectId}`,
        payload
      )

      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async removeSubjectFromStudyPlan(
    studyPlanId: number,
    subjectId: number
  ): Promise<void> {
    try {
      const response = await api.delete(
        `${BASE_URL}/study-plans/${studyPlanId}/subjects/${subjectId}`
      )

      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async getCareers(): Promise<Career[]> {
    try {
      const response = await api.get(`${BASE_URL}/careers`)

      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async getAllSubjects(): Promise<Subject[]> {
    try {
      const response = await api.get(`${BASE_URL}/subjects`)

      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async updateStudyPlan(id: string, payload: unknown): Promise<StudyPlan> {
    try {
      const response = await api.put(
        `${BASE_URL}/study-plans/${id}`,
        payload
      )

      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async deleteStudyPlan(id: string): Promise<void> {
    try {
      await api.delete(`${BASE_URL}/study-plans/${id}`)
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async searchStudyPlans(filters: Record<string, unknown>): Promise<StudyPlan[]> {
    try {
      const response = await api.get(`${BASE_URL}/study-plans/search`, {
        params: filters
      })

      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async getSubjectsByPlan(planId: string): Promise<StudyPlanSubject[]> {
  return await studyPlanService.getSubjectsByStudyPlan(planId)
  },

  async addSubjectToPlan(
    planId: string,
    payload: { subject_id: string; suggested_semester: number; credits: number }
  ): Promise<void> {
    return await studyPlanService.addSubjectToStudyPlan(Number(planId), Number(payload.subject_id), {
      subject_id: Number(payload.subject_id),
      suggested_semester: payload.suggested_semester,
      credits: payload.credits
    })
  },

  async removeSubjectFromPlan(planId: string, subjectId: string): Promise<void> {
    return await studyPlanService.removeSubjectFromStudyPlan(
      Number(planId),
      Number(subjectId)
    )
  }
}