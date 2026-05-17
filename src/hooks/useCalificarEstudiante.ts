import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Enrollment } from '../models/Enrollment';
import { Evaluation } from '../models/Evaluation';
import { Grade } from '../models/Grade';
import { Rubric } from '../models/Rubric';
import { Student } from '../models/Student';
import { Criterion } from '../models/Criterion';
import { Scale } from '../models/Scale';
import {
  getEnrollmentsByGroup,
  getEvaluation,
  getGradeByEnrollmentAndRubric,
  getRubricWithCriteria,
  saveGrade,
} from '../services/calificacionService';
import { CriterionSelection, GradeDetailPayload, GradePayload } from '../types/rubrica';
import { GradeDetail } from '../models/GradeDetail';

type GradeWithDetails = Grade & { details?: GradeDetail[] };

interface UseCalificarEstudianteParams {
  evaluationId: string;
  groupId: string;
}

const useCalificarEstudiante = ({ evaluationId, groupId }: UseCalificarEstudianteParams) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [rubric, setRubric] = useState<Rubric | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selections, setSelections] = useState<Record<string, CriterionSelection>>({});
  const [gradeStatus, setGradeStatus] = useState<'DRAFT' | 'SENT' | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [enrollmentsData, evaluationData] = await Promise.all([
          getEnrollmentsByGroup(groupId),
          getEvaluation(evaluationId),
        ]);

        if (!evaluationData.rubric_id) {
          throw new Error('La evaluación seleccionada no tiene una rúbrica asociada.');
        }

        const rubricData = await getRubricWithCriteria(evaluationData.rubric_id);

        if (isMounted) {
          setEnrollments(enrollmentsData);
          setEvaluation(evaluationData);
          setRubric(rubricData);
          setCurrentIndex(0);
          setActiveStep(0);
          setGradeStatus(null);
        }

        if (!enrollmentsData.length) {
          throw new Error('No hay estudiantes inscritos en este grupo.');
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

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [evaluationId, groupId]);

  const currentEnrollment = useMemo(
    () => enrollments[currentIndex],
    [enrollments, currentIndex]
  );

  const currentStudent = useMemo(
    () => currentEnrollment?.student,
    [currentEnrollment]
  );

  const criteria = useMemo(() => rubric?.criteria || [], [rubric]);

  const scaleMap = useMemo(() => {
    const map = new Map<string, { criterion: Criterion; scale: Scale }>();

    for (const criterion of criteria) {
      for (const scale of criterion.scales || []) {
        if (scale.id) {
          map.set(scale.id, { criterion, scale });
        }
      }
    }

    return map;
  }, [criteria]);

  const totalScore = useMemo(() => {
    return criteria.reduce((accumulator, criterion) => {
      const selection = selections[criterion.id || ''];

      if (!selection?.scale_id) {
        return accumulator;
      }

      const selectedScale = scaleMap.get(selection.scale_id)?.scale;
      const scaleValue = selectedScale?.value ?? 0;
      const criterionWeight = criterion.weight ?? 0;

      return accumulator + (scaleValue * criterionWeight) / 100;
    }, 0);
  }, [criteria, selections, scaleMap]);

  const allCriteriaSelected = useMemo(() => {
    if (!criteria.length) {
      return false;
    }

    return criteria.every((criterion) => Boolean(selections[criterion.id || '']?.scale_id));
  }, [criteria, selections]);

  const progressCount = useMemo(() => {
    const done = criteria.filter((criterion) => Boolean(selections[criterion.id || '']?.scale_id)).length;

    return {
      done,
      total: criteria.length,
    };
  }, [criteria, selections]);

  useEffect(() => {
    let isMounted = true;

    const loadCurrentGrade = async () => {
      if (!currentEnrollment?.id || !rubric?.id) {
        setSelections({});
        setGradeStatus(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        setSelections({});

        const grade = (await getGradeByEnrollmentAndRubric(
          currentEnrollment.id,
          rubric.id
        )) as GradeWithDetails | null;

        if (!isMounted) {
          return;
        }

        if (!grade?.details?.length) {
          setGradeStatus(grade?.status === 'SENT' ? 'SENT' : 'DRAFT');
          return;
        }

        const nextSelections: Record<string, CriterionSelection> = {};

        for (const detail of grade.details) {
          if (!detail.scale_id) {
            continue;
          }

          const scaleMatch = scaleMap.get(detail.scale_id);

          if (!scaleMatch?.criterion.id) {
            continue;
          }

          const criterionId = scaleMatch.criterion.id;

          nextSelections[criterionId] = {
            criterion_id: criterionId,
            scale_id: detail.scale_id,
            comment: detail.comment || '',
          };
        }

        setSelections(nextSelections);
        setGradeStatus(grade.status === 'SENT' ? 'SENT' : 'DRAFT');
      } catch (loadError) {
        if (isMounted) {
          const message = loadError instanceof Error ? loadError.message : 'Error al cargar la calificación.';
          setError(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCurrentGrade();

    return () => {
      isMounted = false;
    };
  }, [currentEnrollment?.id, rubric?.id, scaleMap]);

  const handleSelectScale = (criterionId: string, scaleId: string) => {
    setSelections((prevSelections) => ({
      ...prevSelections,
      [criterionId]: {
        criterion_id: criterionId,
        scale_id: scaleId,
        comment: prevSelections[criterionId]?.comment || '',
      },
    }));
  };

  const handleCommentChange = (criterionId: string, comment: string) => {
    setSelections((prevSelections) => ({
      ...prevSelections,
      [criterionId]: {
        criterion_id: criterionId,
        scale_id: prevSelections[criterionId]?.scale_id || '',
        comment,
      },
    }));
  };

  const handlePrevStudent = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNextStudent = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, Math.max(enrollments.length - 1, 0)));
  };

  const buildGradeDetails = (): GradeDetailPayload[] => {
    return criteria
      .map((criterion) => selections[criterion.id || ''])
      .filter((selection): selection is CriterionSelection => Boolean(selection?.scale_id))
      .map((selection) => ({
        scale_id: selection.scale_id,
        comment: selection.comment?.trim() ? selection.comment : undefined,
      }));
  };

  const persistGrade = async (status: 'DRAFT' | 'SENT') => {
    if (!currentEnrollment?.id || !rubric?.id) {
      throw new Error('No se pudo determinar la evaluación actual.');
    }

    const payload: GradePayload = {
      enrollment_id: currentEnrollment.id,
      rubric_id: rubric.id,
      details: buildGradeDetails(),
      status,
      observations: undefined,
    };

    return saveGrade(payload);
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      await persistGrade('DRAFT');
      setGradeStatus('DRAFT');
      toast.success('Calificación guardada como borrador.');
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : 'No se pudo guardar el borrador.';
      setError(message);
      toast.error(message);
      throw saveError;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSend = async () => {
    if (!allCriteriaSelected) {
      const message = 'Debes seleccionar una escala en todos los criterios para enviar la calificación.';
      setError(message);
      toast.error(message);
      throw new Error(message);
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await persistGrade('SENT');
      setGradeStatus('SENT');
      toast.success('Calificación enviada correctamente.');
    } catch (sendError) {
      const message = sendError instanceof Error ? sendError.message : 'No se pudo enviar la calificación.';
      setError(message);
      toast.error(message);
      throw sendError;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    enrollments,
    evaluation,
    rubric,
    currentIndex,
    selections,
    loading,
    isSubmitting,
    error,
    currentEnrollment,
    currentStudent,
    totalScore,
    allCriteriaSelected,
    progressCount,
    activeStep,
    setActiveStep,
    gradeStatus,
    handleSelectScale,
    handleCommentChange,
    handlePrevStudent,
    handleNextStudent,
    handleSaveDraft,
    handleSend,
    setError,
    setCurrentIndex,
    setSelections,
  };
};

export default useCalificarEstudiante;