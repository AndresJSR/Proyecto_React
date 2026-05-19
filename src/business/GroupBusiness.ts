// esta es mi version darling 

import {
  Group,
  CreateGroupDto,
  UpdateGroupDto,
  GroupFilters
} from '../models/Group'

import { groupService } from '../services/groupService'

class GroupBusiness {
  async getGroups(
    filters?: GroupFilters
  ): Promise<Group[]> {
    const groups =
      await groupService.getGroups()

    if (!filters) {
      return groups
    }

    return groups.filter((group) => {
      const matchesSearch =
        !filters.search ||
        group.name
          .toLowerCase()
          .includes(
            filters.search.toLowerCase()
          ) ||
        group.group_code
          .toLowerCase()
          .includes(
            filters.search.toLowerCase()
          )

      const matchesTeacher =
        !filters.teacher_id ||
        group.teacher_id ===
          filters.teacher_id

      const matchesSemester =
        !filters.semester_id ||
        group.semester_id ===
          filters.semester_id

      const matchesSubject =
        !filters.subject_id ||
        group.subject_id ===
          filters.subject_id

      return (
        matchesSearch &&
        matchesTeacher &&
        matchesSemester &&
        matchesSubject
      )
    })
  }

  async getGroupById(
    id: string
  ): Promise<Group | null> {
    return await groupService.getGroupById(
      id
    )
  }

  async createGroup(
    data: CreateGroupDto
  ): Promise<Group | null> {
    if (!data.name.trim()) {
      throw new Error(
        'Group name is required'
      )
    }

    if (!data.group_code.trim()) {
      throw new Error(
        'Group code is required'
      )
    }

    if (!data.teacher_id) {
      throw new Error(
        'Teacher is required'
      )
    }

    if (!data.subject_id) {
      throw new Error(
        'Subject is required'
      )
    }

    if (!data.semester_id) {
      throw new Error(
        'Semester is required'
      )
    }

    if (data.capacity <= 0) {
      throw new Error(
        'Capacity must be greater than 0'
      )
    }

    return await groupService.createGroup(
      data
    )
  }

  async updateGroup(
    id: string,
    data: UpdateGroupDto
  ): Promise<Group | null> {
    if (
      data.capacity !== undefined &&
      data.capacity <= 0
    ) {
      throw new Error(
        'Capacity must be greater than 0'
      )
    }

    return await groupService.updateGroup(
      id,
      data
    )
  }

  async deleteGroup(
    id: string
  ): Promise<boolean> {
    return await groupService.deleteGroup(
      id
    )
  }
}

export const groupBusiness =
  new GroupBusiness()