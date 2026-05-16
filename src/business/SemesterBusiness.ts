import {
  Semester,
  CreateSemesterDto,
  UpdateSemesterDto,
  SemesterFilters
} from '../models/Semester'

import { semesterService} from '../services/semesterService'

class SemesterBusiness {
  async createSemester(
    payload: CreateSemesterDto
  ): Promise<Semester> {

    if (!payload.name.trim()) {
      throw new Error('Semester name is required')
    }

    if (!payload.code.trim()) {
      throw new Error('Semester code is required')
    }

    if (!payload.start_date) {
      throw new Error('Start date is required')
    }

    if (!payload.end_date) {
      throw new Error('End date is required')
    }

    const startDate = new Date(payload.start_date)
    const endDate = new Date(payload.end_date)

    if (startDate >= endDate) {
      throw new Error(
        'Start date must be earlier than end date'
      )
    }

    return await semesterService.createSemester(payload)
  }

  async getSemesters(): Promise<Semester[]> {
    return await semesterService.getSemesters()
  }

  async getSemesterById(
    id: string
  ): Promise<Semester> {

    if (!id) {
      throw new Error('Semester id is required')
    }

    return await semesterService.getSemesterById(id)
  }

  async updateSemester(
    id: string,
    payload: UpdateSemesterDto
  ): Promise<Semester> {

    if (!id) {
      throw new Error('Semester id is required')
    }

    if (
      payload.start_date &&
      payload.end_date
    ) {

      const startDate = new Date(payload.start_date)
      const endDate = new Date(payload.end_date)

      if (startDate >= endDate) {
        throw new Error(
          'Start date must be earlier than end date'
        )
      }
    }

    return await semesterService.updateSemester(
      id,
      payload
    )
  }

  async deleteSemester(
    id: string
  ): Promise<void> {

    if (!id) {
      throw new Error('Semester id is required')
    }

    await semesterService.deleteSemester(id)
  }

  async searchSemesters(
    filters: SemesterFilters
  ): Promise<Semester[]> {

    return await semesterService.searchSemesters(
      filters
    )
  }
}

export const semesterBusiness =
  new SemesterBusiness()