import React from 'react'

import { StudyPlan } from '../../models/StudyPlan'

interface Props {
  studyPlans: StudyPlan[]
  onEdit: (studyPlan: StudyPlan) => void
  onDelete: (studyPlan: StudyPlan) => void
}

const StudyPlanTable: React.FC<Props> = ({ studyPlans, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead className="bg-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="border px-3 py-3">Semestre sugerido</th>
            <th className="border px-3 py-3">Código</th>
            <th className="border px-3 py-3">Asignatura</th>
            <th className="border px-3 py-3">Créditos</th>
            <th className="border px-3 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {studyPlans.length === 0 ? (
            <tr>
              <td colSpan={5} className="border px-3 py-6 text-center text-sm text-gray-500">
                No hay asignaturas en este plan.
              </td>
            </tr>
          ) : (
            studyPlans.map((studyPlan) => (
              <tr key={studyPlan.id} className="hover:bg-gray-50">
                <td className="border px-3 py-3">{studyPlan.suggested_semester}</td>
                <td className="border px-3 py-3">{studyPlan.subject?.code || studyPlan.subject_id}</td>
                <td className="border px-3 py-3">{studyPlan.subject?.name || studyPlan.name}</td>
                <td className="border px-3 py-3">{studyPlan.subject?.credits ?? '-'}</td>
                <td className="border px-3 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(studyPlan)}
                      className="rounded bg-blue-600 px-3 py-1 text-white text-xs hover:bg-blue-700"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(studyPlan)}
                      className="rounded bg-red-600 px-3 py-1 text-white text-xs hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default StudyPlanTable
