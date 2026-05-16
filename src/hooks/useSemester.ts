import { useEffect, useState } from 'react'

import {
  Semester,
  CreateSemesterDto
} from '../models/Semester'

import {
  semesterBusiness
} from '../business/SemesterBusiness'

export const useSemester = () => {

  const [semesters, setSemesters] =
    useState<Semester[]>([])

  const [loading, setLoading] =
    useState<boolean>(false)

  const [error, setError] =
    useState<string | null>(null)

  const loadSemesters = async () => {

    try {

      setLoading(true)

      const data =
        await semesterBusiness.getSemesters()

      setSemesters(data)

    } catch (err: any) {

      setError(err.message)

    } finally {

      setLoading(false)
    }
  }

  const createSemester = async (
    payload: CreateSemesterDto
  ) => {

    try {

      setLoading(true)

      await semesterBusiness.createSemester(
        payload
      )

      await loadSemesters()

    } catch (err: any) {

      setError(err.message)
      throw err

    } finally {

      setLoading(false)
    }
  }

  const deleteSemester = async (
    id: string
  ) => {

    try {

      setLoading(true)

      await semesterBusiness.deleteSemester(id)

      await loadSemesters()

    } catch (err: any) {

      setError(err.message)
      throw err

    } finally {

      setLoading(false)
    }
  }

  useEffect(() => {
    loadSemesters()
  }, [])

  return {
    semesters,
    loading,
    error,
    createSemester,
    deleteSemester,
    loadSemesters
  }
}