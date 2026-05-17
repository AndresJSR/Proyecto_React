import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import RubricaStepper from '../../components/rubrica/RubricaStepper';
import RubricaInfoSection from '../../components/rubrica/RubricaInfoSection';
import RubricaCriteriosTable from '../../components/rubrica/RubricaCriteriosTable';
import RubricaFooterActions from '../../components/rubrica/RubricaFooterActions';
import useRubricaForm from '../../hooks/useRubricaForm';
import { getSubjects } from '../../services/rubricaService';
import { Subject } from '../../types/rubrica';

const RubricaCreatePage = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const {
    activeStep,
    setActiveStep,
    info,
    criterios,
    totalPeso,
    canPublish,
    error,
    setError,
    handleInfoChange,
    addCriterio,
    updateCriterio,
    deleteCriterio,
    moveCriterio,
    handleGuardarBorrador,
    handlePublicar,
  } = useRubricaForm();

  useEffect(() => {
    let isMounted = true;

    const loadSubjects = async () => {
      try {
        const data = await getSubjects();

        if (isMounted) {
          setSubjects(data);
        }
      } catch (error) {
        console.error('Error al cargar asignaturas:', error);
      } finally {
        if (isMounted) {
          setSubjectsLoading(false);
        }
      }
    };

    loadSubjects();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRevisarContinuar = () => {
    setActiveStep((prevStep) => Math.min(prevStep + 1, 3));
  };

  const handleSubmitGuardarBorrador = async () => {
    setIsSubmitting(true);

    try {
      await handleGuardarBorrador();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitPublicar = async () => {
    setIsSubmitting(true);

    try {
      await handlePublicar();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 px-4 pb-6 sm:px-6 lg:px-8">
      <Breadcrumb pageName="Crear rúbrica de evaluación" />

      <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h1 className="text-2xl font-semibold text-black dark:text-white">
          Crear rúbrica de evaluación
        </h1>
        <p className="mt-2 text-sm text-meta-3 dark:text-meta-2">
          Diseña los criterios y asigna los pesos porcentuales para tu rúbrica.
        </p>
      </div>

      <div className="space-y-6">
        <RubricaStepper
          activeStep={activeStep}
          steps={['Información de la rúbrica', 'Criterios', 'Revisión', 'Publicar o guardar']}
        />

        <RubricaInfoSection
          info={info}
          onChange={handleInfoChange}
          subjects={subjects}
          subjectsLoading={subjectsLoading}
        />

        {error !== null && (
          <div className="flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-500/40 dark:bg-red-950/30 dark:text-red-200">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="ml-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-lg font-semibold transition hover:bg-red-100 dark:hover:bg-red-900/40"
              aria-label="Cerrar alerta"
            >
              ×
            </button>
          </div>
        )}

        <RubricaCriteriosTable
          criterios={criterios}
          onUpdate={updateCriterio}
          onDelete={deleteCriterio}
          onAdd={addCriterio}
          onMove={moveCriterio}
        />

        <RubricaFooterActions
          totalPeso={totalPeso}
          canPublish={canPublish}
          activeStep={activeStep}
          isSubmitting={isSubmitting}
          onCancel={() => navigate(-1)}
          onGuardarBorrador={handleSubmitGuardarBorrador}
          onPublicar={handleSubmitPublicar}
          onRevisarContinuar={handleRevisarContinuar}
        />
      </div>
    </div>
  );
};

export default RubricaCreatePage;
