import { Link } from 'react-router-dom'

import { misNotasBusiness } from '../../business/MisNotasBusiness'
import useMisNotas from '../../hooks/useMisNotas'

const getScoreBadgeColor = (score: number | null): string => {
  if (score === null) return 'bg-gray-100 text-gray-700 dark:bg-meta-4 dark:text-gray-300'
  if (score >= 90) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
  if (score >= 70) return 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
  if (score >= 50) return 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300'
  return 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300'
}

const getStatusBadgeColor = (status: string): string => {
  const color = misNotasBusiness.getStatusColor(status)

  if (color === 'yellow') return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300'
  if (color === 'green') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'

  return 'bg-gray-100 text-gray-700 dark:bg-meta-4 dark:text-gray-300'
}

const MisNotas = () => {
  const { rows, loading, error, promedioPonderado } = useMisNotas()

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300">
        <Link to="/" className="transition hover:text-primary">
          Inicio
        </Link>
        <span>&gt;</span>
        <span className="font-medium text-gray-700 dark:text-white">Mis notas</span>
      </nav>

      <div>
        <h2 className="text-2xl font-bold text-black dark:text-white">
          Mis notas
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-300">
          Consulta las calificaciones registradas en tus evaluaciones.
        </p>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="rounded-3xl border border-stroke bg-white p-6 shadow-sm dark:border-strokedark dark:bg-boxdark">
            <div className="space-y-3 animate-pulse">
              <div className="h-4 w-40 rounded bg-gray-200 dark:bg-meta-4" />
              <div className="h-8 w-24 rounded bg-gray-200 dark:bg-meta-4" />
            </div>
          </div>

          <div className="rounded-3xl border border-stroke bg-white p-8 shadow-sm dark:border-strokedark dark:bg-boxdark">
            <div className="space-y-3 animate-pulse">
              <div className="h-4 w-full rounded bg-gray-200 dark:bg-meta-4" />
              <div className="h-4 w-11/12 rounded bg-gray-200 dark:bg-meta-4" />
              <div className="h-4 w-10/12 rounded bg-gray-200 dark:bg-meta-4" />
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
          {error}
        </div>
      ) : (
        <>
          <div className="rounded-3xl border border-stroke bg-white p-6 shadow-sm dark:border-strokedark dark:bg-boxdark">
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Promedio ponderado general
            </p>

            <div className="mt-3 flex items-center gap-3">
              <div className={`inline-flex rounded-full px-4 py-2 text-xl font-bold ${getScoreBadgeColor(promedioPonderado)}`}>
                {misNotasBusiness.formatScore(promedioPonderado)}
              </div>
            </div>
          </div>

          {rows.length === 0 ? (
            <div className="rounded-3xl border border-stroke bg-white p-8 text-center shadow-sm dark:border-strokedark dark:bg-boxdark">
              <p className="text-sm text-gray-500 dark:text-gray-300">
                No tienes notas registradas aún.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark">
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-0 text-left">
                  <thead className="bg-gray-50 dark:bg-meta-4">
                    <tr>
                      <th className="px-4 py-4 text-sm font-semibold text-gray-700 dark:text-white">
                        Evaluación
                      </th>
                      <th className="px-4 py-4 text-sm font-semibold text-gray-700 dark:text-white">
                        Asignatura
                      </th>
                      <th className="px-4 py-4 text-sm font-semibold text-gray-700 dark:text-white">
                        Grupo
                      </th>
                      <th className="px-4 py-4 text-sm font-semibold text-gray-700 dark:text-white">
                        Peso
                      </th>
                      <th className="px-4 py-4 text-sm font-semibold text-gray-700 dark:text-white">
                        Nota
                      </th>
                      <th className="px-4 py-4 text-sm font-semibold text-gray-700 dark:text-white">
                        Estado
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((row, index) => (
                      <tr
                        key={row.gradeId ?? `nota-${index}`}
                        className="border-t transition hover:bg-gray-50 dark:border-strokedark dark:hover:bg-meta-4"
                      >
                        <td className="px-4 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {row.evaluationName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {row.evaluationCode}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {row.subjectName}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {row.groupName}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {row.weight}%
                        </td>
                        <td className={`px-4 py-4 text-sm font-semibold ${row.isLocked ? 'font-bold' : ''}`}>
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getScoreBadgeColor(row.finalScore)}`}>
                            {misNotasBusiness.formatScore(row.finalScore)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeColor(row.status)}`}
                          >
                            {misNotasBusiness.getStatusLabel(row.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default MisNotas
