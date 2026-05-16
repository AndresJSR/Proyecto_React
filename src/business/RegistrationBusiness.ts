// src/business/RegistrationBusiness.ts

import {
  CreateRegistrationDto,
  UpdateRegistrationDto
} from '../models/Registration'

import { registrationService } from '../services/registrationService'

class RegistrationBusiness {
  async getRegistrations() {
    return await registrationService.getRegistrations()
  }

  async createRegistration(
    data: CreateRegistrationDto
  ) {
    if (
      !data.student_id ||
      !data.career_id
    ) {
      throw new Error(
        'Student and career are required'
      )
    }

    return await registrationService.createRegistration(
      data
    )
  }

  async updateRegistration(
    id: string,
    data: UpdateRegistrationDto
  ) {
    return await registrationService.updateRegistration(
      id,
      data
    )
  }

  async deleteRegistration(id: string) {
    await registrationService.deleteRegistration(
      id
    )
  }
}

export const registrationBusiness =
  new RegistrationBusiness()