import { Career } from './Career'
import { Subject } from './Subject'

export interface StudyPlan {
  id: string

  career_id: string
  subject_id: string

  name: string
  year: number
  suggested_semester: number

  is_published: boolean

  created_at: string
  updated_at: string

  career?: Career
  subject?: Subject
}

export interface CreateStudyPlanDto {
  career_id: string
  subject_id: string
  name: string
  year: number
  suggested_semester: number
}

export interface UpdateStudyPlanDto {
  career_id?: string
  subject_id?: string
  name?: string
  year?: number
  suggested_semester?: number
  is_published?: boolean
}

export interface StudyPlanFilters {
  is_published?: boolean
  year?: number
  search?: string
}