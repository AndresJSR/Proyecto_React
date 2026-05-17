import React from 'react'
import { Semester } from '../../models/Semester'

interface Props {
  semesters: Semester[]
  onEdit: (semester: Semester) => void
  onDelete: (id: string) => void
}

const SemesterTable: React.FC<Props> = ({
  semesters,
  onEdit,
  onDelete
}) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="w-full">

        <thead className="border-b bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Código</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nombre</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Carrera</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Fecha inicio</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Fecha fin</th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Estado</th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {semesters.map((semester) => (
            <tr key={semester.id} className="border-b hover:bg-gray-50 transition">

              <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                {semester.code}
              </td>

              <td className="px-6 py-4 text-sm text-gray-900">
                {semester.name}
              </td>

              <td className="px-6 py-4 text-sm text-gray-600">
                {semester.career_name || '-'}
              </td>

              <td className="px-6 py-4 text-sm text-gray-600">
                {semester.start_date}
              </td>

              <td className="px-6 py-4 text-sm text-gray-600">
                {semester.end_date}
              </td>

              <td className="px-6 py-4 text-center">
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                  semester.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {
                    semester.is_active
                      ? 'Activo'
                      : 'Inactivo'
                  }
                </span>
              </td>

              <td className="px-6 py-4 text-center">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onEdit(semester)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() => onDelete(semester.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  )
}

export default SemesterTable