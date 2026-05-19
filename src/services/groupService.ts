// mi version darlingg 
import axios from 'axios'

import {
  Group,
  CreateGroupDto,
  UpdateGroupDto,
  GroupFilters
} from '../models/Group'

const API_URL =
  `${import.meta.env.VITE_API_URL || '/api'}/groups`

class GroupService {
  async getGroups(): Promise<Group[]> {
    try {
      const response =
        await axios.get<Group[]>(
          API_URL
        )

      return response.data
    } catch (error) {
      console.error(
        'Error al obtener grupos:',
        error
      )

      return []
    }
  }

  async getGroupById(
    id: string
  ): Promise<Group | null> {
    try {
      const response =
        await axios.get<Group>(
          `${API_URL}/${id}`
        )

      return response.data
    } catch (error) {
      console.error(
        'Error al obtener grupo:',
        error
      )

      return null
    }
  }

  async createGroup(
    payload: CreateGroupDto
  ): Promise<Group | null> {
    try {
      const response =
        await axios.post<Group>(
          API_URL,
          payload
        )

      return response.data
    } catch (error) {
      console.error(
        'Error al crear grupo:',
        error
      )

      return null
    }
  }

  async updateGroup(
    id: string,
    payload: UpdateGroupDto
  ): Promise<Group | null> {
    try {
      const response =
        await axios.put<Group>(
          `${API_URL}/${id}`,
          payload
        )

      return response.data
    } catch (error) {
      console.error(
        'Error al actualizar grupo:',
        error
      )

      return null
    }
  }

  async deleteGroup(
    id: string
  ): Promise<boolean> {
    try {
      await axios.delete(
        `${API_URL}/${id}`
      )

      return true
    } catch (error) {
      console.error(
        'Error al eliminar grupo:',
        error
      )

      return false
    }
  }

  async searchGroups(
    filters: GroupFilters
  ): Promise<Group[]> {
    try {
      const response =
        await axios.get<Group[]>(
          `${API_URL}/search`,
          {
            params: filters
          }
        )

      return response.data
    } catch (error) {
      console.error(
        'Error al buscar grupos:',
        error
      )

      return []
    }
  }
}

export const groupService =
  new GroupService()