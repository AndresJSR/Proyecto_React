// src/models/Enrollment.ts
// version darling

import { Student } from './Student'
import { Group } from './Group'

export interface Enrollment {
  id: string

  student_id: string
  group_id: string

  enrollment_date: string
  status: string

  created_at: string
  updated_at: string

  student?: Student
  group?: Group
}

export interface CreateEnrollmentDto {
  student_id: string
  group_id: string
  status?: string
}

export interface UpdateEnrollmentDto {
  status?: string
}

export interface EnrollmentFilters {
  student_id?: string
  group_id?: string
  status?: string
}