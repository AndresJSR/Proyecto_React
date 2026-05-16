import React from 'react'

import { Subject } from '../../models/Subject'

interface Props {
  subjects: Subject[]

  onEdit: (subject: Subject) => void

  onDelete: (id: string) => void
}

const SubjectTable: React.FC<Props> = ({
  subjects,
  onEdit,
  onDelete
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Code</th>
            <th className="p-3 text-left">Credits</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-center">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {subjects.map((subject) => (
            <tr
              key={subject.id}
              className="border-b"
            >
              <td className="p-3">
                {subject.name}
              </td>

              <td className="p-3">
                {subject.code}
              </td>

              <td className="p-3">
                {subject.credits}
              </td>

              <td className="p-3">
                {subject.is_active
                  ? 'Active'
                  : 'Inactive'}
              </td>

              <td className="p-3">
                <div className="flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onEdit(subject)
                    }
                    className="rounded bg-yellow-500 px-3 py-1 text-white"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onDelete(subject.id)
                    }
                    className="rounded bg-red-500 px-3 py-1 text-white"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {subjects.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="p-4 text-center"
              >
                No subjects found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default SubjectTable