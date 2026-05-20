import { useEffect, useMemo, useState } from 'react'

import { Group } from '../models/Group'
import { Subject } from '../models/Subject'
import { StudyPlan } from '../models/StudyPlan'
import { Career } from '../models/Career'

import { groupBusiness, buildAcademicInfo, filterStudyPlansBySubject, GroupAcademicInfo } from '../business/GroupBusiness'
import { studyPlanService } from '../services/studyPlanService'
import { careerService } from '../services/careerService'

interface UseDetalleGrupoReturn {
  group: Group | null
  isLoading: boolean
  error: string | null
  academicInfo: GroupAcademicInfo | null
  isLoadingAcademic: boolean
}

export const useDetalleGrupo = (groupId: string): UseDetalleGrupoReturn => {
  // ── Fase 1: grupo principal ──────────────────────────────────────────────
  const [group, setGroup] = useState<Group | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ── Fase 2-3: datos académicos ───────────────────────────────────────────
  const [subject, setSubject] = useState<Subject | null>(null)
  const [studyPlans, setStudyPlans] = useState<StudyPlan[] | null>(null)
  const [career, setCareer] = useState<Career | null>(null)
  const [isLoadingAcademic, setIsLoadingAcademic] = useState(false)

  // Fase 1: cargar el grupo
  useEffect(() => {
    if (!groupId) return

    let cancelled = false

    const loadGroup = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await groupBusiness.getGroupById(groupId)
        if (!cancelled) setGroup(data)
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : 'Error al cargar el grupo')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadGroup()
    return () => { cancelled = true }
  }, [groupId])

  // Cuando el grupo carga, extraer subject embebido o dejar para el plan
  useEffect(() => {
    if (group?.subject) {
      setSubject(group.subject)
    }
  }, [group])

  // Fase 2: cargar planes de estudio una vez que tenemos el subject_id
  useEffect(() => {
    if (!group?.subject_id) return

    let cancelled = false

    const loadAcademic = async () => {
      setIsLoadingAcademic(true)
      try {
        // Fase 2: planes por asignatura
        let plans = await studyPlanService.getStudyPlansBySubject(group.subject_id)

        // Si el backend no filtra, filtrar localmente
        if (plans.length > 0 && String(plans[0].subject_id) !== String(group.subject_id)) {
          plans = filterStudyPlansBySubject(plans, group.subject_id)
        }

        if (!cancelled) setStudyPlans(plans)

        // Fase 3: carrera desde el primer plan
        const firstPlan = plans[0] ?? null
        if (firstPlan?.career_id) {
          try {
            const careerData = await careerService.getCareerById(String(firstPlan.career_id))
            if (!cancelled) setCareer(careerData)
          } catch {
            // fallo en carrera no bloquea
            if (!cancelled) setCareer(null)
          }
        }
      } catch {
        // fallo en planes no bloquea el grupo
        if (!cancelled) setStudyPlans([])
      } finally {
        if (!cancelled) setIsLoadingAcademic(false)
      }
    }

    loadAcademic()
    return () => { cancelled = true }
  }, [group?.subject_id])

  // Calcular academicInfo cuando los datos estén listos
  const academicInfo = useMemo<GroupAcademicInfo | null>(() => {
    const resolvedSubject = subject ?? group?.subject ?? null
    if (!resolvedSubject || !studyPlans) return null
    return buildAcademicInfo(resolvedSubject, studyPlans, career)
  }, [subject, studyPlans, career, group])

  return { group, isLoading, error, academicInfo, isLoadingAcademic }
}

export default useDetalleGrupo
