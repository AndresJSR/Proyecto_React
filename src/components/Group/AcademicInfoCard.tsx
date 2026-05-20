import { GroupAcademicInfo } from '../../business/GroupBusiness'

type AcademicInfoCardProps = {
  skeleton?: boolean
  info?: GroupAcademicInfo | null
}

const AcademicInfoCard = ({ skeleton, info }: AcademicInfoCardProps) => {
  if (skeleton) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-5 space-y-4 animate-pulse">
        <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    )
  }

  if (!info) {
    return null
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-5 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Información académica
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Datos de asignatura, plan y carrera.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-gray-50 dark:bg-gray-900 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Asignatura</p>
          <p className="font-medium text-gray-800 dark:text-gray-100">{info.subjectName}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{info.subjectCode}</p>
        </div>

        <div className="rounded-xl bg-gray-50 dark:bg-gray-900 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Créditos</p>
          <p className="font-medium text-gray-800 dark:text-gray-100">{info.creditsLabel}</p>
        </div>

        <div className="rounded-xl bg-gray-50 dark:bg-gray-900 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Plan de estudio</p>
          <p className="font-medium text-gray-800 dark:text-gray-100">{info.studyPlanName}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Año {info.studyPlanYear ?? 'No especificado'}
          </p>
        </div>

        <div className="rounded-xl bg-gray-50 dark:bg-gray-900 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Carrera</p>
          <p className="font-medium text-gray-800 dark:text-gray-100">{info.careerName}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {info.suggestedSemesterLabel}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AcademicInfoCard
