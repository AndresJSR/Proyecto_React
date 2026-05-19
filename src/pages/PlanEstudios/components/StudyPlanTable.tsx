import { Fragment } from 'react'

import { StudyPlanSubject } from '../../../types/studyPlan'

interface Props {
  subjectsBySemester: Record<number, StudyPlanSubject[]>
  planName: string
  isPublished: boolean
  totalSubjects: number
  onEdit: (subject: StudyPlanSubject) => void
  onDelete: (subject: StudyPlanSubject) => void
}

const StudyPlanTable = ({ subjectsBySemester, planName, isPublished, totalSubjects, onEdit, onDelete }: Props) => {
  const semesters = Object.keys(subjectsBySemester)
    .map(Number)
    .sort((left, right) => left - right)

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-black dark:text-white">{planName}</h3>
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {isPublished ? 'Publicado' : 'Borrador'}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">{totalSubjects} asignatura{totalSubjects === 1 ? '' : 's'} en el plan</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200">
        <table className="min-w-full border-separate border-spacing-0 text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">Semestre</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">Código</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">Asignatura</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">Créditos</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {semesters.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                  No hay asignaturas en este plan.
                </td>
              </tr>
            ) : (
              semesters.map((semester) => (
                <Fragment key={semester}>
                  <tr key={`semester-${semester}`} className="bg-green-50/60">
                    <td colSpan={5} className="px-4 py-3 text-sm font-semibold text-green-800">
                      Semestre {semester}
                    </td>
                </Fragment>
                  {subjectsBySemester[semester].map((subject) => (
                    <tr key={subject.subject_id + '-' + semester} className="border-t transition hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600">{subject.suggested_semester}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{subject.subject_code}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{subject.subject_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{subject.credits}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            type="button"
                            onClick={() => onEdit(subject)}
                            className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-green-700"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(subject)}
                            className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-5 rounded-2xl border border-dashed border-green-200 bg-green-50 px-4 py-5 text-center text-sm font-medium text-green-700">
        Arrastra asignaturas aquí para agregarlas al plan
      </div>
    </div>
  )
}

export default StudyPlanTable