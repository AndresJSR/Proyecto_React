import React from 'react'

interface Props {
  value: string
  onChange: (value: string) => void
}

const SubjectSearchBar: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <label className="block text-sm font-semibold text-gray-700">Buscar asignatura</label>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Nombre o código"
        className="mt-3 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  )
}

export default SubjectSearchBar
