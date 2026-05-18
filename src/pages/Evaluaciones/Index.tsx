import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';

const EvaluacionesPage = () => {
  return (
    <div className="space-y-6 px-4 pb-6 sm:px-6 lg:px-8">
      <Breadcrumb
        pageName="Evaluaciones"
        items={[
          { label: 'Inicio', to: '/' },
          { label: 'Evaluaciones' },
        ]}
      />

      <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h1 className="text-2xl font-semibold text-black dark:text-white">Evaluaciones</h1>
        <p className="mt-2 text-sm text-meta-3 dark:text-meta-2">
          Administra la asociación de rúbricas y el proceso de calificación.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-black dark:text-white">Asociar rúbrica</h2>
              <p className="mt-1 text-sm text-meta-3 dark:text-meta-2">
                Vincula una rúbrica publicada a una evaluación y asignatura.
              </p>
            </div>
            <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Flujo inicial
            </span>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/evaluaciones/asociar-rubrica"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
            >
              Ir a asociar rúbrica
            </Link>
          </div>
        </section>

        <section className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-black dark:text-white">Calificar estudiante</h2>
              <p className="mt-1 text-sm text-meta-3 dark:text-meta-2">
                Abre una evaluación y un grupo para registrar la calificación por criterio.
              </p>
            </div>
            <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
              Disponible
            </span>
          </div>

          <div className="mt-6 rounded-md border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900 dark:border-sky-500/30 dark:bg-sky-950/20 dark:text-sky-100">
            Usa la ruta dinámica <span className="font-semibold">/evaluaciones/:evaluationId/:groupId/calificar</span> para calificar.
          </div>
        </section>
      </div>
    </div>
  );
};

export default EvaluacionesPage;