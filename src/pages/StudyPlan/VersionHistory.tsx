import React from 'react'

const VersionHistory: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Historial de versiones</h1>
      <p className="mt-2 text-sm text-gray-600">Listado de versiones publicadas y borradores.</p>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-500">(Aquí se mostrará la lista de versiones con filtros y acciones)</p>
      </div>
    </div>
  )
}

export default VersionHistory
