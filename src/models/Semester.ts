//este es mi cambio darling 
export interface Semester {
  id: string
  name: string
  code: string
  start_date: string
  end_date: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface CreateSemesterDto {
  name: string
  code: string
  start_date: string
  end_date: string
  is_active?: boolean
}

export interface UpdateSemesterDto {
  name?: string
  code?: string
  start_date?: string
  end_date?: string
  is_active?: boolean
}

export interface SemesterFilters {
  name?: string
  code?: string
  is_active?: boolean
}