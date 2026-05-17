interface RubricaFooterActionsProps {
  totalPeso: number;
  canPublish: boolean;
  activeStep: number;
  isSubmitting: boolean;
  onCancel: () => void;
  onGuardarBorrador: () => void;
  onPublicar: () => void;
  onRevisarContinuar: () => void;
}

const RubricaFooterActions = ({
  totalPeso,
  canPublish,
  activeStep,
  isSubmitting,
  onCancel,
  onGuardarBorrador,
  onPublicar,
  onRevisarContinuar,
}: RubricaFooterActionsProps) => {
  const isTotalOk = totalPeso === 100;
  const totalTextColor = isTotalOk ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400';

  return (
    <div className="space-y-5 rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-meta-3 dark:text-meta-2">
          Puedes arrastrar los criterios para reordenarlos.
        </p>
        <div className="text-right">
          <p className={`text-sm font-semibold ${totalTextColor}`}>
            Total: {totalPeso}%
          </p>
          <p className="text-xs text-meta-3 dark:text-meta-2">
            {isTotalOk
              ? 'La suma de pesos está bien.'
              : 'La suma de pesos debe ser exactamente 100%.'}
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 md:items-center">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-md border border-stroke bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray disabled:cursor-not-allowed disabled:opacity-60 dark:border-strokedark dark:bg-boxdark dark:text-white dark:hover:bg-meta-4"
        >
          Cancelar
        </button>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onGuardarBorrador}
            disabled={isSubmitting}
            className="rounded-md border border-primary bg-white px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar como borrador'}
          </button>
          <button
            type="button"
            onClick={activeStep === 3 ? onPublicar : onRevisarContinuar}
            disabled={isSubmitting || (activeStep < 3 && !canPublish)}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Guardando...' : activeStep === 3 ? 'Publicar' : 'Revisar y continuar'}
          </button>
        </div>
      </div>

      <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-700/40 dark:bg-amber-950/30 dark:text-amber-200">
        <p className="font-medium">Advertencia</p>
        <p className="mt-1">
          La rúbrica no puede publicarse si no tiene criterios o si la suma de pesos no es exactamente 100%.
        </p>
      </div>
    </div>
  );
};

export default RubricaFooterActions;
