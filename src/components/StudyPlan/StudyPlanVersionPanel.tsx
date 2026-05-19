import React from 'react'
import { StudyPlanVersion } from '../../models/StudyPlanVersion'

interface Props {
  versions: StudyPlanVersion[]
  selectedVersionId?: string
  onSelectVersion: (version: StudyPlanVersion) => void
}

const StudyPlanVersionPanel: React.FC<Props> = ({ versions, selectedVersionId, onSelectVersion }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold">Historial de versiones</h3>
      <div className="mt-3 space-y-3">
        {versions.length === 0 ? (
          <div className="text-sm text-gray-500">No hay versiones disponibles.</div>
        ) : (
          versions.map((version) => (
            <div
              key={version.id}
              className={`flex items-center justify-between rounded-xl border px-3 py-3 ${selectedVersionId === version.id ? 'border-blue-500 bg-blue-50' : 'border-transparent bg-white'}`}
            >
              <div>
                <div className="text-sm font-medium">{version.name || version.year}</div>
                <div className="text-xs text-gray-500">{version.subjects_count ?? 0} asignaturas • {version.total_credits ?? 0} créditos</div>
              </div>
              <button
                type="button"
                onClick={() => onSelectVersion(version)}
                className="text-sm text-blue-600 hover:underline"
              >
                Ver
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default StudyPlanVersionPanel
