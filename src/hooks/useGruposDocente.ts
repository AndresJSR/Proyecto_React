import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'

import { RootState } from '../store/store'
import { Group } from '../models/Group'
import { groupService } from '../services/groupService'
import { groupBusiness } from '../business/GroupBusiness'

interface UseGruposDocenteResult {
  groups: Group[]
  isLoading: boolean
  error: string | null
}

const useGruposDocente = (): UseGruposDocenteResult => {
  const user = useSelector((state: RootState) => state.user.user)

  const [groups, setGroups] = useState<Group[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.id) return

    const fetchGrupos = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const raw = await groupService.getGroupsByTeacher(user.id!)
        const filtered = groupBusiness.filterActiveGroups(raw)
        setGroups(filtered)
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Error al cargar los grupos'
        setError(msg)
        toast.error(msg)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGrupos()
  }, [user?.id])

  return { groups, isLoading, error }
}

export default useGruposDocente