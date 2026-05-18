import { useEffect, useMemo, useState } from 'react';
import fireToast from './fireToast';
import { associateRubric, getEvaluations, getPublishedRubrics, getSubjects } from '../services/evaluacionService';
import { Evaluation } from '../models/Evaluation';
import { Rubric } from '../models/Rubric';
import { Subject } from '../models/Subject';
import { AsociarRubricaFormState } from '../types/rubrica';

const initialFormState: AsociarRubricaFormState = {
  evaluation_id: '',
  rubric_id: '',
  subject_id: '',
};

const useAsociarRubrica = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [formState, setFormState] = useState<AsociarRubricaFormState>(initialFormState);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [evaluationsData, rubricsData, subjectsData] = await Promise.all([
          getEvaluations(),
          getPublishedRubrics(),
          getSubjects(),
        ]);

        if (!rubricsData.length) {
          throw new Error('No hay rúbricas publicadas disponibles para asociar.');
        }

        if (isMounted) {
          setEvaluations(evaluationsData);
          setRubrics(rubricsData);
          setSubjects(subjectsData);
        }
      } catch (loadError) {
        if (isMounted) {
          const message = loadError instanceof Error ? loadError.message : 'Error al cargar los datos.';
          setError(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedEvaluation = useMemo(
    () => evaluations.find((evaluation) => evaluation.id === formState.evaluation_id),
    [evaluations, formState.evaluation_id]
  );

  const selectedRubric = useMemo(
    () => rubrics.find((rubric) => rubric.id === formState.rubric_id),
    [rubrics, formState.rubric_id]
  );

  const selectedSubject = useMemo(
    () => subjects.find((subject) => subject.id === formState.subject_id),
    [subjects, formState.subject_id]
  );

  const canConfirm = Boolean(
    formState.evaluation_id && formState.rubric_id && formState.subject_id
  );

  const handleSelectEvaluation = (id: string) => {
    setFormState((prevState) => ({
      ...prevState,
      evaluation_id: id,
    }));
  };

  const handleSelectRubric = (id: string) => {
    setFormState((prevState) => ({
      ...prevState,
      rubric_id: id,
    }));
  };

  const handleSelectSubject = (id: string) => {
    setFormState((prevState) => ({
      ...prevState,
      subject_id: id,
    }));
  };

  const handleNextStep = () => {
    setActiveStep((prevStep) => Math.min(prevStep + 1, 2));
  };

  const handlePrevStep = () => {
    setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const handleConfirm = async () => {
    if (!canConfirm) {
      const msg = 'Debes seleccionar una evaluación, una rúbrica y una asignatura.';
      setError(msg);
      throw new Error(msg);
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await associateRubric(formState.evaluation_id, formState.rubric_id);
      fireToast();
    } catch (confirmError) {
      const message =
        confirmError instanceof Error ? confirmError.message : 'Error al asociar la rúbrica.';
      setError(message);
      throw confirmError;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    evaluations,
    rubrics,
    subjects,
    loading,
    error,
    isSubmitting,
    activeStep,
    formState,
    selectedEvaluation,
    selectedRubric,
    selectedSubject,
    canConfirm,
    handleSelectEvaluation,
    handleSelectRubric,
    handleSelectSubject,
    handleNextStep,
    handlePrevStep,
    handleConfirm,
    setError,
    setActiveStep,
    setFormState,
  };
};

export default useAsociarRubrica;