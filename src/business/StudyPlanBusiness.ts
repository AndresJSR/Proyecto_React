import {
  CreateStudyPlanDto,
  UpdateStudyPlanDto
} from '../models/StudyPlan'

import { studyPlanService } from '../services/studyPlanService'

class StudyPlanBusiness {
  async getStudyPlans() {
    return await studyPlanService.getStudyPlans()
  }

  async getStudyPlanById(id: string) {
    return await studyPlanService.getStudyPlanById(id)
  }

  async createStudyPlan(
    payload: CreateStudyPlanDto
  ) {
    if (!payload.name.trim()) {
      throw new Error(
        'Study plan name is required'
      )
    }

    if (!payload.career_id) {
      throw new Error(
        'Career is required'
      )
    }

    if (!payload.subject_id) {
      throw new Error(
        'Subject is required'
      )
    }

    if (payload.year <= 0) {
      throw new Error(
        'Year is invalid'
      )
    }

    return await studyPlanService.createStudyPlan(
      payload
    )
  }

  async updateStudyPlan(
    id: string,
    payload: UpdateStudyPlanDto
  ) {
    return await studyPlanService.updateStudyPlan(
      id,
      payload
    )
  }

  async deleteStudyPlan(id: string) {
    return await studyPlanService.deleteStudyPlan(
      id
    )
  }
}

export const studyPlanBusiness =
  new StudyPlanBusiness()