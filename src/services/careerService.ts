import api from './api'

import {
  Career,
  CreateCareerDto,
  UpdateCareerDto,
  CareerFilters
} from '../models/Career'

const BASE_URL = '/academic'

export const careerService = {
  async createCareer(payload: CreateCareerDto): Promise<Career> {
    const response = await api.post(
      `${BASE_URL}/careers`,
      payload
    )

    return response.data.data
  },

  async getCareers(): Promise<Career[]> {
    const response = await api.get(
      `${BASE_URL}/careers`
    )

    return response.data.data
  },

  async getCareerById(id: string): Promise<Career> {
    const response = await api.get(
      `${BASE_URL}/careers/${id}`
    )

    return response.data.data
  },

  async updateCareer(
    id: string,
    payload: UpdateCareerDto
  ): Promise<Career> {
    const response = await api.put(
      `${BASE_URL}/careers/${id}`,
      payload
    )

    return response.data.data
  },

  async deleteCareer(id: string): Promise<void> {
    await api.delete(
      `${BASE_URL}/careers/${id}`
    )
  },

  async searchCareers(
    filters: CareerFilters
  ): Promise<Career[]> {
    const response = await api.get(
      `${BASE_URL}/careers/search`,
      {
        params: filters
      }
    )

    return response.data.data
  }
}