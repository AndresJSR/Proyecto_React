import {
  Group,
  CreateGroupDto,
  UpdateGroupDto,
  GroupFilters
} from '../models/Group'

import { groupService } from '../services/groupService'

export interface GroupCardData {
  id: string
  name: string
  groupCode: string
  subjectName: string
  semesterName: string
  studentCount: number
  groupStatus: 'Activo' | 'Sin estudiantes' | 'Cerrado'
  semesterStatus: 'Activo' | 'Cerrado'
  isEditable: boolean
}

class GroupBusiness {
  async getGroups(
    filters?: GroupFilters
  ): Promise<Group[]> {
    const groups = await groupService.getGroups()

    if (!filters) return groups

    return groups.filter((group) => {
      const matchesSearch =
        !filters.search ||
        group.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        group.group_code.toLowerCase().includes(filters.search.toLowerCase())

      const matchesTeacher =
        !filters.teacher_id || group.teacher_id === filters.teacher_id

      const matchesSemester =
        !filters.semester_id || group.semester_id === filters.semester_id

      const matchesSubject =
        !filters.subject_id || group.subject_id === filters.subject_id

      return matchesSearch && matchesTeacher && matchesSemester && matchesSubject
    })
  }

  async getGroupById(id: string): Promise<Group | null> {
    return await groupService.getGroupById(id)
  }

  async createGroup(data: CreateGroupDto): Promise<Group | null> {
    if (!data.name.trim()) throw new Error('Group name is required')
    if (!data.group_code.trim()) throw new Error('Group code is required')
    if (!data.teacher_id) throw new Error('Teacher is required')
    if (!data.subject_id) throw new Error('Subject is required')
    if (!data.semester_id) throw new Error('Semester is required')
    if (data.capacity <= 0) throw new Error('Capacity must be greater than 0')
    return await groupService.createGroup(data)
  }

  async updateGroup(id: string, data: UpdateGroupDto): Promise<Group | null> {
    if (data.capacity !== undefined && data.capacity <= 0) {
      throw new Error('Capacity must be greater than 0')
    }
    return await groupService.updateGroup(id, data)
  }

  async deleteGroup(id: string): Promise<void> {
    if (!id) throw new Error('Group id is required')
    return await groupService.deleteGroup(id)
  }

  /**
   * Filtra grupos dejando solo los que pertenecen a un semestre activo.
   *
   * Decisión: el endpoint /search?teacher_id ya trae todos los grupos del docente
   * sin distinción de semestre activo. Se filtra aquí en cliente para mostrar
   * solo los relevantes al período vigente.
   * Si el backend en el futuro añade el filtro server-side, esta función
   * simplemente devolverá el array intacto sin romper nada.
   */
  filterActiveGroups(groups: Group[]): Group[] {
    return groups.filter(
      (group) => group.semester?.is_active === true
    )
  }

  /**
   * Transforma el array de Group (modelo de dominio) en GroupCardData
   * (modelo de presentación) para consumo directo por la UI.
   * Toda la lógica derivada vive aquí, nunca en el componente ni en el hook.
   */
  mapGroupsToCards(groups: Group[]): GroupCardData[] {
    return groups.map((group): GroupCardData => {
      const semesterActive = group.semester?.is_active === true
      const studentCount = group.enrollments?.length ?? 0

      let groupStatus: GroupCardData['groupStatus']
      if (!semesterActive) {
        groupStatus = 'Cerrado'
      } else if (studentCount === 0) {
        groupStatus = 'Sin estudiantes'
      } else {
        groupStatus = 'Activo'
      }

      return {
        id: group.id,
        name: group.name,
        groupCode: group.group_code,
        subjectName: group.subject?.name ?? 'Sin asignatura',
        semesterName: group.semester?.name ?? 'Sin semestre',
        studentCount,
        groupStatus,
        semesterStatus: semesterActive ? 'Activo' : 'Cerrado',
        isEditable: semesterActive,
      }
    })
  }
}

export const groupBusiness = new GroupBusiness()