import {
    Career,
    CareerFilters,
    CreateCareerDto,
    UpdateCareerDto
} from '../models/Career'

import { careerService } from '../services/careerService'

class CareerBusiness {
  async createCareer(
    payload: CreateCareerDto
  ): Promise<Career> {

    this.validateCreateCareer(payload)

    try {
      return await careerService.createCareer({
        name: payload.name.trim(),
        code: payload.code.trim().toUpperCase(),
        description: payload.description?.trim()
      })

    } catch (error: any) {

      throw new Error(
        error?.response?.data?.message ||
        'Error creating career'
      )
    }
  }

  async getCareers(): Promise<Career[]> {

    try {
      return await careerService.getCareers()

    } catch (error: any) {

      throw new Error(
        error?.response?.data?.message ||
        'Error fetching careers'
      )
    }
  }

  async getCareerById(
    id: string
  ): Promise<Career> {

    if (!id) {
      throw new Error('Career id is required')
    }

    try {
      return await careerService.getCareerById(id)

    } catch (error: any) {

      throw new Error(
        error?.response?.data?.message ||
        'Error fetching career'
      )
    }
  }

  async updateCareer(
    id: string,
    payload: UpdateCareerDto
  ): Promise<Career> {

    if (!id) {
      throw new Error('Career id is required')
    }

    try {
      return await careerService.updateCareer(id, payload)

    } catch (error: any) {

      throw new Error(
        error?.response?.data?.message ||
        'Error updating career'
      )
    }
  }

  async deleteCareer(
    id: string
  ): Promise<void> {

    if (!id) {
      throw new Error('Career id is required')
    }

    try {
      await careerService.deleteCareer(id)

    } catch (error: any) {

      throw new Error(
        error?.response?.data?.message ||
        'Error deleting career'
      )
    }
  }

  async searchCareers(
    filters: CareerFilters
  ): Promise<Career[]> {

    try {
      return await careerService.searchCareers(filters)

    } catch (error: any) {

      throw new Error(
        error?.response?.data?.message ||
        'Error searching careers'
      )
    }
  }

  private validateCreateCareer(
    payload: CreateCareerDto
  ): void {

    if (!payload.name?.trim()) {
      throw new Error('Career name is required')
    }

    if (!payload.code?.trim()) {
      throw new Error('Career code is required')
    }

    if (payload.code.trim().length < 2) {
      throw new Error(
        'Career code must contain at least 2 characters'
      )
    }
  }
}

export const careerBusiness = new CareerBusiness()