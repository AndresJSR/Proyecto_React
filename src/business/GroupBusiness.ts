import {
  Group,
  CreateGroupDto,
  UpdateGroupDto,
  GroupFilters
} from '../models/Group'
import { Evaluation } from '../models/Evaluation'
import { Grade } from '../models/Grade'
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
  hasEvaluations: boolean
  hasLockedGrades: boolean
}

class GroupBusiness {
  async getGroups(filters?: GroupFilters): Promise<Group[]> {
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
   * Decisión: el endpoint /search?teacher_id ya trae todos los grupos del docente
   * sin distinción de semestre activo. Se filtra aquí en cliente para mostrar
   * solo los relevantes al período vigente.
   */
  filterActiveGroups(groups: Group[]): Group[] {
    return groups.filter((group) => group.semester?.is_active === true)
  }

  /**
   * Transforma el array de Group (modelo de dominio) en GroupCardData
   * (modelo de presentación). Los campos de enriquecimiento (hasEvaluations,
   * hasLockedGrades) se inicializan en false; se completan con enrichGroupCard.
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
        // Se completan en enrichGroupCard tras cargar datos académicos
        hasEvaluations: false,
        hasLockedGrades: false,
      }
    })
  }

  /**
   * Enriquece un GroupCardData con información académica del grupo:
   * si tiene evaluaciones registradas y si alguna nota está bloqueada (is_locked).
   * Función pura: no muta el card original, devuelve uno nuevo.
   */
  enrichGroupCard(
    card: GroupCardData,
    evaluations: Evaluation[],
    grades: Grade[]
  ): GroupCardData {
    return {
      ...card,
      hasEvaluations: evaluations.length > 0,
      hasLockedGrades: grades.some((grade) => grade.is_locked === true),
    }
  }

  /**
   * Devuelve un resumen legible del estado académico del grupo,
   * útil para tooltips y atributos de accesibilidad (title).
   */
  getGroupStatusSummary(card: GroupCardData): string {
    const parts: string[] = []

    parts.push(
      card.semesterStatus === 'Activo' ? 'Semestre activo' : 'Semestre cerrado'
    )

    if (card.groupStatus === 'Sin estudiantes') {
      parts.push('Sin estudiantes inscritos')
    } else if (card.groupStatus === 'Activo') {
      parts.push(`${card.studentCount} estudiante${card.studentCount !== 1 ? 's' : ''}`)
    }

    parts.push(
      card.hasEvaluations
        ? `${card.hasEvaluations ? 'Con evaluaciones' : 'Sin evaluaciones'}`
        : 'Sin evaluaciones'
    )

    if (card.hasLockedGrades) {
      parts.push('Notas consolidadas')
    } else {
      parts.push('Notas pendientes')
    }

    return parts.join(' · ')
  }
}

export const groupBusiness = new GroupBusiness()