import React from 'react'

const StudyPlanTabs: React.FC = () => {
  return (
    <div>
      <div className="flex gap-2 border-b border-gray-100">
        <button className="py-2 px-3 text-sm font-medium text-gray-700 border-b-2 border-blue-600">Estructura del plan</button>
        <button className="py-2 px-3 text-sm font-medium text-gray-500">Borradores</button>
      </div>
    </div>
  )
}

export default StudyPlanTabs
