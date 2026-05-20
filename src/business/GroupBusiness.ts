import {
  Group,
  CreateGroupDto,
  UpdateGroupDto,
  GroupFilters as ServiceGroupFilters,
} from '../models/Group'
import { Evaluation } from '../models/Evaluation'
import { Grade } from '../models/Grade'
import { groupService } from '../services/groupService'
import { Rubric } from '../models/Rubric'
import { Subject } from '../models/Subject'
import { StudyPlan } from '../models/StudyPlan'
import { Career } from '../models/Career'



// ─── Tipos de presentación ────────────────────────────────────────────────────

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
  evaluationCount: number
  publishedRubricCount: number
  gradeStatusLabel: string
  gradeStatusColor: 'green' | 'yellow' | 'red' | 'gray'
}

/** Filtros de UI aplicados localmente sobre GroupCardData[]. */
export interface GroupUIFilters {
  searchSubject: string   // filtra sobre subjectName
  searchCode: string      // filtra sobre groupCode
  semesterName: string    // '' = todos
  groupStatus: string     // '' = todos
}
export interface GroupDetailInfo {
  name: string
  groupCode: string
  subjectName: string
  semesterName: string
  semesterIsActive: boolean
  studentCount: number
  capacity: number | null
  occupancyLabel: string
  statusLabel: string
  statusColor: 'green' | 'yellow' | 'red'
  isEditable: boolean
}
export const EMPTY_GROUP_UI_FILTERS: GroupUIFilters = {
  searchSubject: '',
  searchCode: '',
  semesterName: '',
  groupStatus: '',
}
// ─── Tipos para información académica ────────────────────────────────────────

export interface GroupAcademicInfo {
  subjectName: string
  subjectCode: string
  credits: number
  creditsLabel: string
  careerName: string
  studyPlanName: string
  studyPlanYear: number | null
  suggestedSemester: number | null
  suggestedSemesterLabel: string
}

// ─── Funciones puras de dominio ───────────────────────────────────────────────

/**
 * Filtra planes de estudio que contienen la asignatura indicada.
 * Usado cuando el backend retorna todos los planes sin filtrar.
 */
export function filterStudyPlansBySubject(
  plans: StudyPlan[],
  subjectId: number | string
): StudyPlan[] {
  return plans.filter(
    (p) =>
      String(p.subject_id) === String(subjectId)
  )
}

/**
 * Construye el objeto GroupAcademicInfo a partir de los datos
 * ya cargados (subject, planes y carrera).
 */
export function buildAcademicInfo(
  subject: Subject,
  studyPlans: StudyPlan[],
  career: Career | null
): GroupAcademicInfo {
  const plan = studyPlans[0] ?? null

  const credits = subject.credits ?? 0
  const creditsLabel = `${credits} crédito${credits !== 1 ? 's' : ''}`

  const suggestedSemester = plan?.suggested_semester ?? null
  const suggestedSemesterLabel = suggestedSemester
    ? `Semestre ${suggestedSemester}`
    : 'No especificado'

  return {
    subjectName: subject.name,
    subjectCode: subject.code,
    credits,
    creditsLabel,
    careerName: career?.name ?? 'Carrera no encontrada',
    studyPlanName: plan?.name ?? 'Plan no asociado',
    studyPlanYear: plan?.year ?? null,
    suggestedSemester,
    suggestedSemesterLabel,
  }
}
// ─── Business ────────────────────────────────────────────────────────────────

class GroupBusiness {
  // ── CRUD (dominio) ──────────────────────────────────────────────────────────

  async getGroups(filters?: ServiceGroupFilters): Promise<Group[]> {
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

  // ── Transformación → cards de presentación ──────────────────────────────────

  /**
   * Filtra grupos dejando solo los que pertenecen a un semestre activo.
   * El endpoint /search?teacher_id trae todos los grupos sin distinción de
   * semestre; se filtra en cliente. Si el backend lo asume en el futuro,
   * esta función devuelve el array intacto sin romper nada.
   */
  filterActiveGroups(groups: Group[]): Group[] {
    return groups.filter((group) => group.semester?.is_active === true)
  }
  private deriveGroupStatus(
    semesterActive: boolean,
    studentCount: number
  ): { statusLabel: string; statusColor: 'green' | 'yellow' | 'red' } {
    if (!semesterActive) return { statusLabel: 'Cerrado',          statusColor: 'red'    }
    if (studentCount === 0) return { statusLabel: 'Sin estudiantes', statusColor: 'yellow' }
    return                       { statusLabel: 'Activo',           statusColor: 'green'  }
  }
  /**
   * Transforma Group[] (dominio) en GroupCardData[] (presentación).
   * hasEvaluations y hasLockedGrades se inicializan en false;
   * se completan con enrichGroupCard tras las llamadas async.
   */
  mapGroupsToCards(groups: Group[]): GroupCardData[] {
    return groups.map((group): GroupCardData => {
      const semesterActive = group.semester?.is_active === true
      const studentCount = group.enrollments?.length ?? 0

      const { statusLabel: groupStatusStr } = this.deriveGroupStatus(semesterActive, studentCount)
      const groupStatus = groupStatusStr as GroupCardData['groupStatus']

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
        hasEvaluations: false,
        hasLockedGrades: false,
        evaluationCount: 0,
        publishedRubricCount: 0,
        gradeStatusLabel: 'Pendiente',
        gradeStatusColor: 'red',
      }
    })
  }
  calcularGradeStatus(
    studentCount: number,
    grades: Grade[]
  ): { label: string; color: 'green' | 'yellow' | 'red' | 'gray' } {
    if (studentCount === 0)
      return { label: 'Sin estudiantes', color: 'gray' }
    if (grades.length === 0)
      return { label: 'Sin calificar', color: 'red' }
    if (grades.some((g) => g.is_locked === true))
      return { label: 'Notas consolidadas', color: 'green' }
    if (grades.every((g) => g.status === 'SENT'))
      return { label: 'Calificado', color: 'green' }
    if (grades.some((g) => g.status === 'SENT' || g.status === 'DRAFT'))
      return { label: 'En progreso', color: 'yellow' }
    return { label: 'Pendiente', color: 'red' }
  }

  /**
   * Enriquece un GroupCardData con datos académicos del grupo.
   * Función pura: no muta el card original, devuelve uno nuevo.
   */
enrichGroupCard(
    card: GroupCardData,
    evaluations: Evaluation[],
    grades: Grade[],
    rubrics: Rubric[]
  ): GroupCardData {
    const gradeStatus = this.calcularGradeStatus(card.studentCount, grades)
    return {
      ...card,
      hasEvaluations: evaluations.length > 0,
      hasLockedGrades: grades.some((g) => g.is_locked === true),
      evaluationCount: evaluations.length,
      publishedRubricCount: rubrics.filter((r) => r.is_public === true).length,
      gradeStatusLabel: gradeStatus.label,
      gradeStatusColor: gradeStatus.color,
    }
  }

  /**
   * Devuelve un resumen legible del estado académico del grupo,
   * útil para tooltips y atributo title (accesibilidad).
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

    parts.push(card.hasEvaluations ? 'Con evaluaciones' : 'Sin evaluaciones')
    parts.push(card.hasLockedGrades ? 'Notas consolidadas' : 'Notas pendientes')

    return parts.join(' · ')
  }

  // ── Filtrado local (UI) ─────────────────────────────────────────────────────

  /**
   * Aplica filtros locales sobre GroupCardData[].
   * Todos los criterios se combinan con AND.
   * Si todos los campos son '' devuelve el array completo sin recorrerlo.
   */
  filterGroups(cards: GroupCardData[], filters: GroupUIFilters): GroupCardData[] {
    const { searchSubject, searchCode, semesterName, groupStatus } = filters
    const noFilters =
      !searchSubject && !searchCode && !semesterName && !groupStatus
    if (noFilters) return cards

    return cards.filter((card) => {
      const matchesSubject =
        !searchSubject ||
        card.subjectName.toLowerCase().includes(searchSubject.toLowerCase())

      const matchesCode =
        !searchCode ||
        card.groupCode.toLowerCase().includes(searchCode.toLowerCase())

      const matchesSemester =
        !semesterName || card.semesterName === semesterName

      const matchesStatus =
        !groupStatus || card.groupStatus === groupStatus

      return matchesSubject && matchesCode && matchesSemester && matchesStatus
    })
  }

  /**
   * Extrae nombres de semestre únicos del conjunto de cards,
   * ordenados alfabéticamente. Usado para poblar el select de semestres.
   */
  getUniqueSemesters(cards: GroupCardData[]): string[] {
    const unique = Array.from(new Set(cards.map((c) => c.semesterName)))
    return unique.sort((a, b) => a.localeCompare(b))
  }
    /**
   * Valida que un raw query param sea un entero positivo usable como groupId.
   * Vive en Business para mantener la lógica fuera de la página.
   */
  validateGroupId(raw: string | null): string | null {
    if (!raw || raw.trim() === '') return null
    // Los IDs del proyecto son strings (UUIDs o numéricos como string)
    // Aceptamos cualquier string no vacío y no-whitespace
    return raw.trim() || null
  }
  /**
   * Valida que el docente autenticado sea el propietario del grupo.
   *
   * Decisión de modelo: Group.teacher_id referencia User.id directamente
   * (no Teacher.id), confirmado en src/models/Group.ts donde teacher_id: string
   * coincide con User.id: string. El backend asigna el grupo al user_id del
   * docente, no al id de la tabla teachers.
   *
   * Retorna el mensaje de error si el acceso no está permitido, o null si es válido.
   */
  validateTeacherAccess(group: Group, teacherUserId: string): string | null {
    if (group.teacher_id !== teacherUserId) {
      return 'No tienes permiso para ver este grupo.'
    }
    return null
  }

  /**
   * Wrapper semántico sobre validateTeacherAccess para contextos
   * donde se necesita un boolean en lugar del mensaje de error.
   */
  isGroupOwnedByTeacher(group: Group, teacherUserId: string): boolean {
    return this.validateTeacherAccess(group, teacherUserId) === null
  }
  /**
   * Transforma un Group (dominio) en GroupDetailInfo (presentación de detalle).
   * Nota: si el backend no retorna subject/semester anidados en
   * GET /api/academic/groups/{id}, el hook debe enriquecerlos antes de llamar
   * esta función (ver useDetalleGrupo).
   */
  buildGroupDetailInfo(group: Group): GroupDetailInfo {
    const semesterActive = group.semester?.is_active === true
    const studentCount = group.enrollments?.length ?? 0
    const capacity = group.capacity ?? null
    const { statusLabel, statusColor } = this.deriveGroupStatus(semesterActive, studentCount)

    const occupancyLabel = capacity != null
      ? `${studentCount} / ${capacity} estudiantes`
      : `${studentCount} estudiante${studentCount !== 1 ? 's' : ''}`

    return {
      name:             group.name,
      groupCode:        group.group_code,
      subjectName:      group.subject?.name  ?? 'Sin asignatura',
      semesterName:     group.semester?.name ?? 'Sin semestre',
      semesterIsActive: semesterActive,
      studentCount,
      capacity,
      occupancyLabel,
      statusLabel,
      statusColor,
      isEditable: semesterActive,
    }
  }
}

export const groupBusiness = new GroupBusiness()