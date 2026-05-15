import { useMemo, useState } from 'react';
import { RubricCriterio, RubricFormState } from '../types/rubrica';
import {
  createCriterion,
  createRubric,
  publishRubric,
} from '../services/rubricaService';

const initialFormState: RubricFormState = {
  subject_id: '',
  title: '',
  description: '',
  criterios: [],
};

const initialCriterios: RubricCriterio[] = [
  { id: Date.now().toString() + '-1', name: 'Funcionalidad', description: '', weight: 40 },
  { id: Date.now().toString() + '-2', name: 'Calidad del código', description: '', weight: 30 },
  { id: Date.now().toString() + '-3', name: 'Pruebas y validación', description: '', weight: 20 },
  { id: Date.now().toString() + '-4', name: 'Documentación', description: '', weight: 10 },
];

const useRubricaForm = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [formState, setFormState] = useState<RubricFormState>(initialFormState);
  const [criterios, setCriterios] = useState<RubricCriterio[]>(initialCriterios);
  const [error, setError] = useState<string | null>(null);

  const totalPeso = useMemo(
    () => criterios.reduce((total, criterio) => total + criterio.weight, 0),
    [criterios]
  );

  const handleInfoChange = <K extends keyof RubricFormState>(
    field: K,
    value: RubricFormState[K]
  ) => {
    setFormState((prevInfo) => ({ ...prevInfo, [field]: value }));
  };

  const addCriterio = () => {
    const newCriterio: RubricCriterio = {
      id: Date.now().toString(),
      name: '',
      description: '',
      weight: 0,
    };

    setCriterios((prevCriterios) => [...prevCriterios, newCriterio]);
  };

  const updateCriterio = <K extends keyof RubricCriterio>(
    id: string,
    field: K,
    value: RubricCriterio[K]
  ) => {
    setCriterios((prevCriterios) =>
      prevCriterios.map((criterio) =>
        criterio.id === id ? { ...criterio, [field]: value } : criterio
      )
    );
  };

  const deleteCriterio = (id: string) => {
    setCriterios((prevCriterios) => prevCriterios.filter((criterio) => criterio.id !== id));
  };

  const moveCriterio = (fromIndex: number, toIndex: number) => {
    setCriterios((prevCriterios) => {
      if (
        fromIndex < 0 ||
        fromIndex >= prevCriterios.length ||
        toIndex < 0 ||
        toIndex >= prevCriterios.length ||
        fromIndex === toIndex
      ) {
        return prevCriterios;
      }

      const nextCriterios = [...prevCriterios];
      const [movedItem] = nextCriterios.splice(fromIndex, 1);
      nextCriterios.splice(toIndex, 0, movedItem);
      return nextCriterios;
    });
  };

  const isPesoValido = totalPeso === 100;
  const canPublish = criterios.length > 0 && isPesoValido;

  const persistRubric = async (publish: boolean) => {
    setError(null);

    const rubric = await createRubric({
      title: formState.title,
      description: formState.description,
    });

    for (const criterio of criterios) {
      await createCriterion({
        rubric_id: rubric.id,
        name: criterio.name,
        description: criterio.description,
        weight: criterio.weight,
      });
    }

    if (publish) {
      await publishRubric(rubric.id);
    }
  };

  const handleGuardarBorrador = async () => {
    try {
      await persistRubric(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al guardar la rúbrica';
      setError(message);
      throw error;
    }
  };

  const handlePublicar = async () => {
    try {
      await persistRubric(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al publicar la rúbrica';
      setError(message);
      throw error;
    }
  };

  return {
    activeStep,
    setActiveStep,
    info: formState,
    criterios,
    totalPeso,
    handleInfoChange,
    addCriterio,
    updateCriterio,
    deleteCriterio,
    moveCriterio,
    isPesoValido,
    canPublish,
    error,
    setError,
    handleGuardarBorrador,
    handlePublicar,
  };
};

export default useRubricaForm;
