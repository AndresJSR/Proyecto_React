import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'

import { RootState } from '../store/store'
import { Group } from '../models/Group'
import { GroupCardData, groupBusiness } from '../business/GroupBusiness'
import { groupService } from '../services/groupService'
import {
  getEvaluationsByGroup,
  getGradesByGroup,
} from '../services/evaluacionService'

interface UseGruposDocenteResult {
  groups: Group[]
  groupCards: GroupCardData[]
  isLoading: boolean
  error: string | null
}

const useGruposDocente = (): UseGruposDocenteResult => {
  const user = useSelector((state: RootState) => state.user.user)

  const [groups, setGroups] = useState<Group[]>([])
  const [groupCards, setGroupCards] = useState<GroupCardData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.id) return

    const fetchGrupos = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // 1. Cargar grupos del docente filtrados por semestre activo
        const raw = await groupService.getGroupsByTeacher(user.id!)
        const filtered = groupBusiness.filterActiveGroups(raw)
        setGroups(filtered)

        // 2. Construir cards base (hasEvaluations y hasLockedGrades en false)
        const baseCards = groupBusiness.mapGroupsToCards(filtered)

        // 3. Enriquecer cada card con datos académicos en paralelo
        const enrichedCards = await Promise.all(
          baseCards.map(async (card) => {
            try {
              const [evaluations, grades] = await Promise.all([
                getEvaluationsByGroup(card.id),
                getGradesByGroup(card.id),
              ])
              return groupBusiness.enrichGroupCard(card, evaluations, grades)
            } catch (err) {
              // Fallo parcial: loguear y devolver card con valores por defecto
              console.error(
                `Error al enriquecer grupo ${card.id} (${card.name}):`,
                err
              )
              return card // hasEvaluations=false, hasLockedGrades=false ya establecidos
            }
          })
        )

        setGroupCards(enrichedCards)
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Error al cargar los grupos'
        setError(msg)
        toast.error(msg)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGrupos()
  }, [user?.id])

  return { groups, groupCards, isLoading, error }
}

export default useGruposDocente