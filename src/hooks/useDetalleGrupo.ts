import { Group } from '../models/Group'

interface UseDetalleGrupoResult {
  group: Group | null
  isLoading: boolean
  error: string | null
}

export function useDetalleGrupo(groupId: string): UseDetalleGrupoResult {
  return {
    group: null,
    isLoading: false,
    error: null,
  }
}