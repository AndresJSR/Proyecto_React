import {
  AsociarRubricaFormState,
  CriterionSelection,
  GradeDetailPayload,
  GradePayload,
  RubricCriterio,
  RubricFormState,
} from '../types/rubrica';
import { Criterion } from '../models/Criterion';
import { Scale } from '../models/Scale';
import {
  createCriterion,
  createRubric,
  createScale,
  publishRubric,
} from '../services/rubricaService';
import { associateRubric } from '../services/evaluacionService';
import { saveGrade } from '../services/calificacionService';
import { Grade } from '../models/Grade';

// ─── Rúbrica Form ────────────────────────────────────────────────────────────

export const INITIAL_CRITERIOS: RubricCriterio[] = [
  { id: Date.now().toString() + '-1', name: 'Funcionalidad',       description: '', weight: 40 },
  { id: Date.now().toString() + '-2', name: 'Calidad del código',  description: '', weight: 30 },
  { id: Date.now().toString() + '-3', name: 'Pruebas y validación',description: '', weight: 20 },
  { id: Date.now().toString() + '-4', name: 'Documentación',       description: '', weight: 10 },
];

export const INITIAL_RUBRICA_FORM: RubricFormState = {
  subject_id: '',
  title: '',
  description: '',
  criterios: [],
};

export function calcularTotalPeso(criterios: RubricCriterio[]): number {
  return criterios.reduce((total, c) => total + c.weight, 0);
}

export function isPesoValido(criterios: RubricCriterio[]): boolean {
  return calcularTotalPeso(criterios) === 100;
}

export function validarRubricaParaGuardar(formState: RubricFormState): string | null {
  if (!formState.title.trim()) {
    return 'El título de la rúbrica es obligatorio';
  }
  return null;
}

export function validarRubricaParaPublicar(formState: RubricFormState, criterios: RubricCriterio[]): string | null {
  const errorBase = validarRubricaParaGuardar(formState);
  if (errorBase) return errorBase;

  if (!isPesoValido(criterios)) {
    return 'La suma de los pesos debe ser exactamente 100% para publicar';
  }
  return null;
}

export function buildNewCriterio(): RubricCriterio {
  return {
    id: Date.now().toString(),
    name: '',
    description: '',
    weight: 0,
  };
}

export function moveCriterioInList(
  criterios: RubricCriterio[],
  fromIndex: number,
  toIndex: number,
): RubricCriterio[] {
  if (
    fromIndex < 0 ||
    fromIndex >= criterios.length ||
    toIndex < 0 ||
    toIndex >= criterios.length ||
    fromIndex === toIndex
  ) {
    return criterios;
  }

  const next = [...criterios];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

export async function persistRubric(
  formState: RubricFormState,
  criterios: RubricCriterio[],
  publish: boolean,
): Promise<void> {
  const rubric = await createRubric({
    title: formState.title,
    description: formState.description,
  });

  for (const criterio of criterios) {
    const created = await createCriterion({
      rubric_id: rubric.id,
      name: criterio.name,
      description: criterio.description,
      weight: criterio.weight,
    });

    if (criterio.scales && criterio.scales.length > 0) {
      for (const scale of criterio.scales) {
        await createScale({
          criterion_id: created.id,
          name: scale.name || '',
          description: scale.description,
          value: scale.value,
        });
      }
    }
  }

  if (publish) {
    await publishRubric(rubric.id);
  }
}

// ─── Asociar Rúbrica ─────────────────────────────────────────────────────────

export const INITIAL_ASOCIAR_FORM: AsociarRubricaFormState = {
  evaluation_id: '',
  rubric_id: '',
  subject_id: '',
};

export function validarAsociacion(formState: AsociarRubricaFormState): string | null {
  if (!formState.evaluation_id || !formState.rubric_id || !formState.subject_id) {
    return 'Debes seleccionar una evaluación, una rúbrica y una asignatura.';
  }
  return null;
}

export async function ejecutarAsociacion(formState: AsociarRubricaFormState): Promise<void> {
  await associateRubric(formState.evaluation_id, formState.rubric_id);
}

// ─── Calificar Estudiante ─────────────────────────────────────────────────────

export type ScaleMap = Map<string, { criterion: Criterion; scale: Scale }>;

export function buildScaleMap(criteria: Criterion[]): ScaleMap {
  const map: ScaleMap = new Map();

  for (const criterion of criteria) {
    for (const scale of criterion.scales || []) {
      if (scale.id) {
        map.set(scale.id, { criterion, scale });
      }
    }
  }

  return map;
}

export function calcularPuntajeTotal(
  criteria: Criterion[],
  selections: Record<string, CriterionSelection>,
  scaleMap: ScaleMap,
): number {
  return criteria.reduce((acc, criterion) => {
    const selection = selections[criterion.id || ''];
    if (!selection?.scale_id) return acc;

    const scaleValue = scaleMap.get(selection.scale_id)?.scale?.value ?? 0;
    const weight = criterion.weight ?? 0;

    return acc + (scaleValue * weight) / 100;
  }, 0);
}

export function todosLosCriteriosSeleccionados(
  criteria: Criterion[],
  selections: Record<string, CriterionSelection>,
): boolean {
  if (!criteria.length) return false;
  return criteria.every((c) => Boolean(selections[c.id || '']?.scale_id));
}

export function contarProgreso(
  criteria: Criterion[],
  selections: Record<string, CriterionSelection>,
): { done: number; total: number } {
  return {
    done: criteria.filter((c) => Boolean(selections[c.id || '']?.scale_id)).length,
    total: criteria.length,
  };
}

export function buildGradeDetails(
  criteria: Criterion[],
  selections: Record<string, CriterionSelection>,
): GradeDetailPayload[] {
  return criteria
    .map((c) => selections[c.id || ''])
    .filter((s): s is CriterionSelection => Boolean(s?.scale_id))
    .map((s) => ({
      scale_id: s.scale_id,
      comment: s.comment?.trim() ? s.comment : undefined,
    }));
}

export function buildGradePayload(
  enrollmentId: string,
  rubricId: string,
  criteria: Criterion[],
  selections: Record<string, CriterionSelection>,
  status: 'DRAFT' | 'SENT',
): GradePayload {
  return {
    enrollment_id: enrollmentId,
    rubric_id: rubricId,
    details: buildGradeDetails(criteria, selections),
    status,
    observations: undefined,
  };
}

export async function ejecutarGuardarCalificacion(payload: GradePayload): Promise<Grade> {
  return saveGrade(payload);
}