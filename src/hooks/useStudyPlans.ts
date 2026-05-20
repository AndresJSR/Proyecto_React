import { useEffect, useState } from 'react'

import { StudyPlan } from '../models/StudyPlan'

import { studyPlanBusiness } from '../business/StudyPlanBusiness'
import { studyPlanService } from '../services/studyPlanService'

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

      const [plans, subjects] = await Promise.all([
        studyPlanBusiness.getStudyPlans(),
        subjectService.getSubjects()
      ])

      const enrichedPlans = plans.map((plan) => ({
        ...plan,
        subject: subjects.find(
          (subject) => subject.id === plan.subject_id
        )
      }))

      setStudyPlans(enrichedPlans)

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