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
    <table className="w-full border-collapse border">

      <thead>
        <tr className="bg-gray-200">
          <th className="border p-2">
            Nombre
          </th>

          <th className="border p-2">
            Código
          </th>

          <th className="border p-2">
            Inicio
          </th>

          <th className="border p-2">
            Fin
          </th>

          <th className="border p-2">
            Estado
          </th>

          <th className="border p-2">
            Acciones
          </th>
        </tr>
      </thead>

      <tbody>
        {semesters.map((semester) => (
          <tr key={semester.id}>

            <td className="border p-2">
              {semester.name}
            </td>

            <td className="border p-2">
              {semester.code}
            </td>

            <td className="border p-2">
              {semester.start_date}
            </td>

            <td className="border p-2">
              {semester.end_date}
            </td>

            <td className="border p-2">
              {
                semester.is_active
                  ? 'Activo'
                  : 'Inactivo'
              }
            </td>

            <td className="border p-2 flex gap-2">

              <button
                onClick={() => onEdit(semester)}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Editar
              </button>

              <button
                onClick={() => onDelete(semester.id)}
                className="bg-red-600 text-white px-2 py-1 rounded"
              >
                Eliminar
              </button>

            </td>
          </tr>
        ))}
      </tbody>

    </table>
  )
}

export default SemesterTable