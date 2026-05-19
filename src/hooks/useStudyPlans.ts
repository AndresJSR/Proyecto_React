import { useEffect, useState } from 'react'

import { StudyPlan } from '../models/StudyPlan'

import { studyPlanBusiness } from '../business/StudyPlanBusiness'

const useStudyPlans = () => {
  const [studyPlans, setStudyPlans] =
    useState<StudyPlan[]>([])

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  const refresh = async () => {
    try {
      setLoading(true)

      const data =
        await studyPlanBusiness.getStudyPlans()

      setStudyPlans(data)

      setError(null)
    } catch (error) {
      setError(
        'Could not load study plans'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  return {
    studyPlans,
    loading,
    error,
    refresh
  }
}

export default useStudyPlans