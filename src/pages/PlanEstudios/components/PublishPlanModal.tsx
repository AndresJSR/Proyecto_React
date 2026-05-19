interface Props {
  isOpen: boolean
  careerName: string
  currentYear: number | undefined
  publishYear: number | null
  onYearChange: (y: number) => void
  onConfirm: () => void
  onCancel: () => void
  loadingAction: boolean
}

const PublishPlanModal = ({
  isOpen,
  careerName,
  currentYear,
  publishYear,
  onYearChange,
  onConfirm,
  onCancel,
  loadingAction
}: Props) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-black dark:text-white">Publicar plan</h3>
        <p className="mt-1 text-sm text-gray-500">Define el año de la nueva versión para la carrera {careerName || 'seleccionada'}.</p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Año de publicación</label>
            <input
              type="number"
              min={currentYear ?? new Date().getFullYear()}
              value={publishYear ?? ''}
              onChange={(event) => onYearChange(Number(event.target.value))}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              placeholder={`Ej. ${currentYear ?? new Date().getFullYear()}`}
            />
          </div>

          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            La nueva versión quedará publicada para la carrera {careerName || 'seleccionada'} y reemplazará la versión activa si existe.
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loadingAction}
            className="rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loadingAction ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PublishPlanModal