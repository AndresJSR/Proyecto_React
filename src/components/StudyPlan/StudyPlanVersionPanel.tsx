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
              className={`flex items-center justify-between rounded-2xl border px-4 py-3 shadow-sm ${selectedVersionId === version.id ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-white'}`}
            >
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                  <span>{version.name || version.year}</span>
                  {version.is_published && <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">Publicado</span>}
                </div>
                <div className="mt-1 text-xs text-gray-500">{version.subjects_count ?? 0} asignaturas • {version.total_credits ?? 0} créditos</div>
              </div>
              <button
                type="button"
                onClick={() => onSelectVersion(version)}
                className="rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700"
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
