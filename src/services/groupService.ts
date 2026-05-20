import { api } from '../interceptors/authInterceptor'

import {
  Group,
  CreateGroupDto,
  UpdateGroupDto,
  GroupFilters
} from '../models/Group'

const BASE_URL = '/api/academic/groups'

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return 'Error al ejecutar la operación de grupos'
}

class GroupService {
  async getGroups(): Promise<Group[]> {
    try {
      const response = await api.get(BASE_URL)
      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  }

  async getGroupById(id: string): Promise<Group | null> {
    try {
      const response = await api.get(`${BASE_URL}/${id}`)
      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  }

  async createGroup(payload: CreateGroupDto): Promise<Group> {
    try {
      const response = await api.post(BASE_URL, payload)
      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  }

  async updateGroup(id: string, payload: UpdateGroupDto): Promise<Group> {
    try {
      const response = await api.put(`${BASE_URL}/${id}`, payload)
      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  }

  async deleteGroup(id: string): Promise<void> {
    try {
      await api.delete(`${BASE_URL}/${id}`)
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  }

  async searchGroups(filters: GroupFilters): Promise<Group[]> {
    try {
      const response = await api.get(`${BASE_URL}/search`, { params: filters })
      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  }
}

export const groupService = new GroupService()