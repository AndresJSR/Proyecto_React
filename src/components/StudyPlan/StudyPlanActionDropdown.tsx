import React from 'react'

interface Props {
  onEdit: () => void
  onDelete: () => void
}

const StudyPlanActionDropdown: React.FC<Props> = ({ onEdit, onDelete }) => {
  return (
    <div className="relative inline-block text-left">
      <div>
        <button className="inline-flex justify-center rounded-md px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50">···</button>
      </div>
      <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
        <div className="py-1">
          <button onClick={onEdit} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Editar</button>
          <button onClick={onDelete} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Eliminar</button>
        </div>
      </div>
    </div>
  )
}

export default StudyPlanActionDropdown
