import React from 'react'
import { StudyPlanVersion } from '../../models/StudyPlanVersion'
import StudyPlanTable from './StudyPlanTable'
import { StudyPlanSubject } from '../../types/studyPlan'

interface Props {
  subjects: StudyPlanSubject[]
  careerName?: string
  version?: StudyPlanVersion | null
  onEdit: (subject: StudyPlanSubject) => void
  onDelete: (subject: StudyPlanSubject) => void
}

const StudyPlanSection: React.FC<Props> = ({ subjects, careerName, version, onEdit, onDelete }) => {
  const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0)

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Estructura del plan</h2>
          <p className="text-sm text-gray-500">Carrera: {careerName || 'Sin carrera seleccionada'}</p>
          <p className="text-sm text-gray-500">Versión activa: {version ? `${version.year} • ${version.is_published ? 'Publicado' : 'Borrador'}` : 'No hay versión'}</p>
        </div>
        <button type="button" className="inline-flex items-center rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50">
          Vista por malla
        </button>
      </div>

      <div className="mt-4 rounded border border-dashed border-gray-200 p-4 text-center text-gray-400">
        Arrastra asignaturas aquí o usa el catálogo para agregarlas al plan.
      </div>

      <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{subjects.length} asignaturas en la versión actual</p>
          </div>
        </div>

        <StudyPlanTable subjects={subjects} onEdit={onEdit} onDelete={onDelete} />
      </div>

      <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
        <div className="flex items-center justify-between">
          <span>Total créditos</span>
          <strong>{totalCredits}</strong>
        </div>
      </div>
    </div>
  )
}

export default StudyPlanSection
