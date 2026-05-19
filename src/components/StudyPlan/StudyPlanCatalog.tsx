import React from 'react'
import { Subject } from '../../models/Subject'

interface Props {
  subjects: Subject[]
  search: string
  onSearch: (value: string) => void
  onAdd: (subject: Subject) => void
}

const StudyPlanCatalog: React.FC<Props> = ({ subjects, search, onSearch, onAdd }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold">Catálogo de asignaturas</h3>
      <div className="mt-4 flex items-center gap-2">
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Buscar por nombre o código"
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div className="mt-4 space-y-2 max-h-[420px] overflow-y-auto">
        {subjects.length === 0 ? (
          <div className="rounded p-4 text-sm text-gray-500">No hay asignaturas disponibles</div>
        ) : (
          subjects.map((subject) => (
            <div key={subject.id} className="flex items-center justify-between rounded border border-gray-100 p-3 hover:bg-gray-50">
              <div>
                <div className="text-sm font-medium">{subject.code}</div>
                <div className="text-xs text-gray-500">{subject.name} • {subject.credits} créditos</div>
              </div>
              <button
                type="button"
                onClick={() => onAdd(subject)}
                className="rounded-full bg-green-600 px-3 py-1 text-white text-sm hover:bg-green-700"
              >
                +
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default StudyPlanCatalog
