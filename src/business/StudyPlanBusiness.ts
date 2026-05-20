import {
    CreateStudyPlanDto,
    UpdateStudyPlanDto
} from '../models/StudyPlan'

import { enrollmentService } from '../services/enrollmentService'
import { groupService } from '../services/groupService'
import { studyPlanService } from '../services/studyPlanService'
import { studyPlanVersionService } from '../services/studyPlanVersionService'

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
    this.validateStudyPlanPayload(payload)

    return await studyPlanService.createStudyPlan(
      payload
    )
  }

  async updateStudyPlan(
    id: string,
    payload: UpdateStudyPlanDto
  ) {
    if (!id) {
      throw new Error('Study plan id is required')
    }

    this.validateUpdateStudyPlan(payload)

    return await studyPlanService.updateStudyPlan(
      id,
      payload
    )
  }

  async deleteStudyPlan(id: string) {
    if (!id) {
      throw new Error('Study plan id is required')
    }

    return await studyPlanService.deleteStudyPlan(id)
  }

  async addSubjectToPlan(planId: string, payload: { subject_id: string; suggested_semester: number; credits: number }) {
    if (!planId) throw new Error('Plan id is required')

    if (!payload.subject_id) throw new Error('Subject is required')

    if (payload.suggested_semester <= 0 || payload.suggested_semester > 12) {
      throw new Error('Suggested semester must be between 1 and 12')
    }

    if (!payload.credits || payload.credits <= 0) {
      throw new Error('Credits must be greater than zero')
    }

    // prevent duplicates
    const subjects = await studyPlanService.getSubjectsByPlan(planId)

    const exists = subjects.some((s: any) => s.subject_id === payload.subject_id)

    if (exists) {
      throw new Error('La asignatura ya está presente en el plan')
    }

    return await studyPlanService.addSubjectToPlan(planId, payload)
  }

  async removeSubjectFromPlan(planId: string, subjectId: string) {
    if (!planId || !subjectId) throw new Error('Plan id and subject id are required')

    // Check groups for this subject
    const groups = await groupService.getGroups()

    const relatedGroups = groups.filter((g: any) => g.subject_id === subjectId)

    if (relatedGroups.length > 0) {
      throw new Error('No se puede eliminar la asignatura porque tiene grupos asociados')
    }

    // Check enrollments in groups of that subject
    const enrollments = await enrollmentService.getEnrollments()

    const hasEnrollments = enrollments.some((e: any) => relatedGroups.some((g: any) => g.id === e.group_id))

    if (hasEnrollments) {
      throw new Error('No se puede eliminar la asignatura porque tiene inscripciones activas en algún grupo')
    }

    return await studyPlanService.removeSubjectFromPlan(planId, subjectId)
  }

  async createVersion(payload: { career_id: string; year: number; name: string }) {
    // basic validations
    if (!payload.career_id) throw new Error('Career is required')
    if (!payload.year || payload.year <= 0) throw new Error('Year is invalid')
    if (!payload.name?.trim()) throw new Error('Version name is required')

    // create version via service
    return await studyPlanVersionService.createVersion(payload as any)
  }

  async getVersionsByCareer(careerId: string) {
    if (!careerId) throw new Error('Career id is required')
    return await studyPlanVersionService.getVersionsByCareer(careerId)
  }

  async publishVersion(versionId: string, options: { career_id: string; replace_previous?: boolean }) {
    if (!versionId) throw new Error('Version id is required')
    if (!options?.career_id) throw new Error('Career id is required')

    // Get the version to be published
    const version = await studyPlanVersionService.getVersionById(versionId)
    
    if (!version) {
      throw new Error('Study plan version not found')
    }

    // Verify version belongs to the specified career
    if (version.career_id !== options.career_id) {
      throw new Error('Study plan version does not belong to the specified career')
    }

    // Check if version has subjects
    const subjects = await studyPlanService.getSubjectsByPlan(versionId)
    if (!subjects || subjects.length === 0) {
      throw new Error('Cannot publish a version without subjects')
    }

    // Check for existing published version in same career
    const versions = await studyPlanVersionService.getVersionsByCareer(options.career_id)
    const alreadyPublished = versions.find((v: any) => v.is_published && v.id !== versionId)

    if (alreadyPublished && !options.replace_previous) {
      throw new Error('There is already a published version for this career. Set replace_previous to true to replace it.')
    }

    // If replacing, unpublish the previous version
    if (alreadyPublished && options.replace_previous) {
      await studyPlanService.updateStudyPlan(alreadyPublished.id, { is_published: false })
    }

    return await studyPlanVersionService.publishVersion({ version_id: versionId, replace_previous: !!options.replace_previous })
  }

  private validateStudyPlanPayload(
    payload: CreateStudyPlanDto
  ): void {
    if (!payload.name?.trim()) {
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

    if (
      payload.suggested_semester <= 0 ||
      payload.suggested_semester > 12
    ) {
      throw new Error(
        'Suggested semester must be between 1 and 12'
      )
    }
  }

  private validateUpdateStudyPlan(
    payload: UpdateStudyPlanDto
  ): void {
    if (
      payload.name !== undefined &&
      !payload.name.trim()
    ) {
      throw new Error(
        'Study plan name cannot be empty'
      )
    }

    if (
      payload.year !== undefined &&
      payload.year <= 0
    ) {
      throw new Error(
        'Year is invalid'
      )
    }

    if (
      payload.suggested_semester !== undefined &&
      (payload.suggested_semester <= 0 ||
        payload.suggested_semester > 12)
    ) {
      throw new Error(
        'Suggested semester must be between 1 and 12'
      )
    }
  }
}

export const studyPlanBusiness =
  new StudyPlanBusiness()