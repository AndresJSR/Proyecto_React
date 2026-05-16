import {
  Subject,
  CreateSubjectDto,
  UpdateSubjectDto,
  SubjectFilters
} from '../models/Subject'

import { subjectService } from '../services/subjectService'

export const subjectBusiness = {
  async createSubject(
    payload: CreateSubjectDto
  ): Promise<Subject> {
    this.validateSubject(payload)

    return await subjectService.createSubject(
      payload
    )
  },

  async getSubjects(): Promise<Subject[]> {
    return await subjectService.getSubjects()
  },

  async getSubjectById(
    id: string
  ): Promise<Subject> {
    if (!id) {
      throw new Error(
        'Subject id is required'
      )
    }

    return await subjectService.getSubjectById(
      id
    )
  },

  async updateSubject(
    id: string,
    payload: UpdateSubjectDto
  ): Promise<Subject> {
    if (!id) {
      throw new Error(
        'Subject id is required'
      )
    }

    this.validateUpdateSubject(payload)

    return await subjectService.updateSubject(
      id,
      payload
    )
  },

  async deleteSubject(
    id: string
  ): Promise<void> {
    if (!id) {
      throw new Error(
        'Subject id is required'
      )
    }

    await subjectService.deleteSubject(id)
  },

  async searchSubjects(
    filters: SubjectFilters
  ): Promise<Subject[]> {
    return await subjectService.searchSubjects(
      filters
    )
  },

  validateSubject(
    payload: CreateSubjectDto
  ): void {
    if (!payload.name?.trim()) {
      throw new Error(
        'Subject name is required'
      )
    }

    if (!payload.code?.trim()) {
      throw new Error(
        'Subject code is required'
      )
    }

    if (
      payload.credits === undefined ||
      payload.credits <= 0
    ) {
      throw new Error(
        'Credits must be greater than zero'
      )
    }
  },

  validateUpdateSubject(
    payload: UpdateSubjectDto
  ): void {
    if (
      payload.name !== undefined &&
      !payload.name.trim()
    ) {
      throw new Error(
        'Subject name cannot be empty'
      )
    }

    if (
      payload.code !== undefined &&
      !payload.code.trim()
    ) {
      throw new Error(
        'Subject code cannot be empty'
      )
    }

    if (
      payload.credits !== undefined &&
      payload.credits <= 0
    ) {
      throw new Error(
        'Credits must be greater than zero'
      )
    }
  }
}