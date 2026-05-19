// src/services/enrollmentService.ts
//version darling

import api from './api'

import {
  Enrollment,
  CreateEnrollmentDto,
  UpdateEnrollmentDto,
  EnrollmentFilters
} from '../models/Enrollment'

const BASE_URL = '/academic'

export const enrollmentService = {
  async createEnrollment(
    payload: CreateEnrollmentDto
  ): Promise<Enrollment> {
    const response = await api.post(
      `${BASE_URL}/enrollments`,
      payload
    )

    return response.data.data
  },

  async getEnrollments(): Promise<
    Enrollment[]
  > {
    const response = await api.get(
      `${BASE_URL}/enrollments`
    )

    return response.data.data
  },

  async getEnrollmentById(
    id: string
  ): Promise<Enrollment> {
    const response = await api.get(
      `${BASE_URL}/enrollments/${id}`
    )

    return response.data.data
  },

  async updateEnrollment(
    id: string,
    payload: UpdateEnrollmentDto
  ): Promise<Enrollment> {
    const response = await api.put(
      `${BASE_URL}/enrollments/${id}`,
      payload
    )

    return response.data.data
  },

  async deleteEnrollment(
    id: string
  ): Promise<void> {
    await api.delete(
      `${BASE_URL}/enrollments/${id}`
    )
  },

  async searchEnrollments(
    filters: EnrollmentFilters
  ): Promise<Enrollment[]> {
    const response = await api.get(
      `${BASE_URL}/enrollments/search`,
      {
        params: filters
      }
    )

    return response.data.data
  }
}