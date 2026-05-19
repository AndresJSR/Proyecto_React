import React from 'react'

interface Props {
  status: 'all' | 'active' | 'inactive'
  credits: string
  onStatusChange: (value: 'all' | 'active' | 'inactive') => void
  onCreditsChange: (value: string) => void
  onClear: () => void
}

const SubjectFilters: React.FC<Props> = ({ status, credits, onStatusChange, onCreditsChange, onClear }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Estado</label>
            <select
              value={status}
              onChange={(event) => onStatusChange(event.target.value as 'all' | 'active' | 'inactive')}
              className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none"
            >
              <option value="all">Todos</option>
              <option value="active">Activo</option>
              <option value="inactive">Archivado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Créditos</label>
            <input
              type="number"
              min={0}
              value={credits}
              onChange={(event) => onCreditsChange(event.target.value)}
              placeholder="Min"
              className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  )
}

export default SubjectFilters
