import { useEffect, useMemo, useState } from 'react';
import fireToast from './fireToast';
import { getEvaluations, getPublishedRubrics, getSubjects } from '../services/evaluacionService';
import { Evaluation } from '../models/Evaluation';
import { Rubric } from '../models/Rubric';
import { Subject } from '../models/Subject';
import { AsociarRubricaFormState } from '../types/rubrica';
import {
  INITIAL_ASOCIAR_FORM,
  ejecutarAsociacion,
  validarAsociacion,
} from '../business/RubricaBusiness';

const useAsociarRubrica = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [formState, setFormState] = useState<AsociarRubricaFormState>(INITIAL_ASOCIAR_FORM);

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
          setError(loadError instanceof Error ? loadError.message : 'Error al cargar los datos.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, []);

  const selectedEvaluation = useMemo(
    () => evaluations.find((e) => e.id === formState.evaluation_id),
    [evaluations, formState.evaluation_id],
  );

  const selectedRubric = useMemo(
    () => rubrics.find((r) => r.id === formState.rubric_id),
    [rubrics, formState.rubric_id],
  );

  const selectedSubject = useMemo(
    () => subjects.find((s) => s.id === formState.subject_id),
    [subjects, formState.subject_id],
  );

  const canConfirm = Boolean(
    formState.evaluation_id && formState.rubric_id && formState.subject_id,
  );

  const handleSelectEvaluation = (id: string) =>
    setFormState((prev) => ({ ...prev, evaluation_id: id }));

  const handleSelectRubric = (id: string) =>
    setFormState((prev) => ({ ...prev, rubric_id: id }));

  const handleSelectSubject = (id: string) =>
    setFormState((prev) => ({ ...prev, subject_id: id }));

  const handleNextStep = () =>
    setActiveStep((prev) => Math.min(prev + 1, 2));

  const handlePrevStep = () =>
    setActiveStep((prev) => Math.max(prev - 1, 0));

  const handleConfirm = async () => {
    const validationError = validarAsociacion(formState);
    if (validationError) {
      setError(validationError);
      throw new Error(validationError);
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await ejecutarAsociacion(formState);
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