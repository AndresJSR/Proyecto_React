import React from 'react'

import { StudyPlan } from '../../models/StudyPlan'

interface Props {
  studyPlans: StudyPlan[]

  onEdit: (
    studyPlan: StudyPlan
  ) => void

  onDelete: (id: string) => void
}

const StudyPlanTable: React.FC<Props> = ({
  studyPlans,
  onEdit,
  onDelete
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">
              Name
            </th>

            <th className="border p-2">
              Year
            </th>

            <th className="border p-2">
              Semester
            </th>

            <th className="border p-2">
              Published
            </th>

            <th className="border p-2">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {studyPlans.map((studyPlan) => (
            <tr key={studyPlan.id}>
              <td className="border p-2">
                {studyPlan.name}
              </td>

              <td className="border p-2">
                {studyPlan.year}
              </td>

              <td className="border p-2">
                {
                  studyPlan.suggested_semester
                }
              </td>

              <td className="border p-2">
                {studyPlan.is_published
                  ? 'Yes'
                  : 'No'}
              </td>

              <td className="border p-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onEdit(studyPlan)
                    }
                    className="rounded bg-blue-500 px-3 py-1 text-white"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onDelete(studyPlan.id)
                    }
                    className="rounded bg-red-500 px-3 py-1 text-white"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StudyPlanTable