import React from 'react'

import {
  CreateStudyPlanDto,
  UpdateStudyPlanDto
} from '../../models/StudyPlan'

interface Props {
  formData:
    | CreateStudyPlanDto
    | UpdateStudyPlanDto

  onChange: (
    field: string,
    value: string | number | boolean
  ) => void

  onSubmit: () => void

  loading?: boolean
}

const StudyPlanForm: React.FC<Props> = ({
  formData,
  onChange,
  onSubmit,
  loading = false
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block">
          Name
        </label>

        <input
          type="text"
          value={formData.name || ''}
          onChange={(e) =>
            onChange('name', e.target.value)
          }
          className="w-full rounded border p-2"
        />
      </div>

      <div>
        <label className="mb-1 block">
          Career ID
        </label>

        <input
          type="text"
          value={formData.career_id || ''}
          onChange={(e) =>
            onChange(
              'career_id',
              e.target.value
            )
          }
          className="w-full rounded border p-2"
        />
      </div>

      <div>
        <label className="mb-1 block">
          Subject ID
        </label>

        <input
          type="text"
          value={formData.subject_id || ''}
          onChange={(e) =>
            onChange(
              'subject_id',
              e.target.value
            )
          }
          className="w-full rounded border p-2"
        />
      </div>

      <div>
        <label className="mb-1 block">
          Year
        </label>

        <input
          type="number"
          value={formData.year || 0}
          onChange={(e) =>
            onChange(
              'year',
              Number(e.target.value)
            )
          }
          className="w-full rounded border p-2"
        />
      </div>

      <div>
        <label className="mb-1 block">
          Suggested Semester
        </label>

        <input
          type="number"
          value={
            formData.suggested_semester || 0
          }
          onChange={(e) =>
            onChange(
              'suggested_semester',
              Number(e.target.value)
            )
          }
          className="w-full rounded border p-2"
        />
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={loading}
        className="rounded bg-primary px-4 py-2 text-white"
      >
        {loading
          ? 'Saving...'
          : 'Save Study Plan'}
      </button>
    </div>
  )
}

export default StudyPlanForm