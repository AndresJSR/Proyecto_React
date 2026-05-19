export interface StudyPlanVersion {
  id: string
  career_id: string
  year: number
  name: string
  is_published: boolean
  subjects_count?: number
  total_credits?: number
  created_at?: string
  updated_at?: string
}

export interface CreateStudyPlanVersionDto {
  career_id: string
  year: number
  name: string
}

export interface PublishVersionDto {
  replace_previous?: boolean
}
