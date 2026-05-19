import React from 'react'
import { StudyPlan } from '../../models/StudyPlan'
import { StudyPlanVersion } from '../../models/StudyPlanVersion'

interface Props {
  careerName?: string
  version?: StudyPlanVersion | null
  planItems: StudyPlan[]
}

const StudyPlanDetailsCard: React.FC<Props> = ({ careerName, version, planItems }) => {
  const totalCredits = planItems.reduce((sum, item) => sum + (item.subject?.credits || 0), 0)

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm mb-4">
      <h3 className="text-lg font-semibold">Detalles del plan</h3>
      <div className="mt-4 space-y-2 text-sm text-gray-700">
        <div>Carrera: {careerName || 'Sin carrera seleccionada'}</div>
        <div>Versión: {version ? `${version.year}` : 'Sin versión'}</div>
        <div>
          Estado:
          <span className={`ml-2 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${version?.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {version?.is_published ? 'Publicado' : 'Borrador'}
          </span>
        </div>
        <div>Total asignaturas: {planItems.length}</div>
        <div>Total créditos: {totalCredits}</div>
        <div>Última actualización: {version?.updated_at || 'N/A'}</div>
      </div>
    </div>
  )
}

export default StudyPlanDetailsCard
