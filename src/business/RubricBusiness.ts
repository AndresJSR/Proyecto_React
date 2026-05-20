import { Rubric } from '../models/Rubric';
import { Group } from '../models/Group';
import { Evaluation } from '../models/Evaluation';
import { Criterion } from '../models/Criterion';
import { Scale } from '../models/Scale';
import {
  RubricCriterion,
  RubricFormState,
  GradePayload,
  CriterionSelection
} from '../types/rubric';

import {
  createCriterion,
  createRubric,
  createScale,
  publishRubric,
} from '../services/rubricService';

import { saveGrade } from '../services/gradeService';

// ─── Initial constants ────────────────────────────────────────────────────────

export const INITIAL_CRITERIA: RubricCriterion[] = [
  {
    id: Date.now().toString() + '-1',
    name: 'Functionality',
    description: '',
    weight: 40
  },
  {
    id: Date.now().toString() + '-2',
    name: 'Code Quality',
    description: '',
    weight: 30
  },
  {
    id: Date.now().toString() + '-3',
    name: 'Testing and Validation',
    description: '',
    weight: 20
  },
  {
    id: Date.now().toString() + '-4',
    name: 'Documentation',
    description: '',
    weight: 10
  },
];

export const INITIAL_RUBRIC_FORM: RubricFormState = {
  subject_id: '',
  title: '',
  description: '',
  criteria: [],
};

// ─── Pure functions — rubric form ────────────────────────────────────────────

export const buildNewCriterion = (): RubricCriterion => ({
  id: Date.now().toString(),
  name: '',
  description: '',
  weight: 0,
});

export const calculateTotalWeight = (
  criteria: RubricCriterion[]
): number =>
  criteria.reduce(
    (total, criterion) => total + criterion.weight,
    0
  );

export const isValidWeight = (
  criteria: RubricCriterion[]
): boolean =>
  calculateTotalWeight(criteria) === 100;

export const moveCriterionInList = (
  criteria: RubricCriterion[],
  fromIndex: number,
  toIndex: number
): RubricCriterion[] => {
  if (
    fromIndex < 0 ||
    fromIndex >= criteria.length ||
    toIndex < 0 ||
    toIndex >= criteria.length ||
    fromIndex === toIndex
  ) {
    return criteria;
  }

  const next = [...criteria];

  const [moved] = next.splice(fromIndex, 1);

  next.splice(toIndex, 0, moved);

  return next;
};

export const validateRubricForSave = (
  form: RubricFormState
): string | null => {
  if (!form.subject_id) {
    return 'You must select a subject';
  }

  if (!form.title?.trim()) {
    return 'Rubric title is required';
  }

  return null;
};

export const validateRubricForPublish = (
  form: RubricFormState,
  criteria: RubricCriterion[]
): string | null => {
  const baseError = validateRubricForSave(form);

  if (baseError) {
    return baseError;
  }

  if (criteria.length === 0) {
    return 'You must add at least one criterion';
  }

  if (!isValidWeight(criteria)) {
    return 'The total weight must be exactly 100% to publish';
  }

  return null;
};

export const persistRubric = async (
  form: RubricFormState,
  criteria: RubricCriterion[],
  publish: boolean
): Promise<void> => {
  const rubric = await createRubric({
    title: form.title,
    description: form.description,
  });

  for (const criterion of criteria) {
    const created = await createCriterion({
      rubric_id: rubric.id,
      name: criterion.name,
      description: criterion.description,
      weight: criterion.weight,
    });

    if (criterion.scales && criterion.scales.length > 0) {
      for (const scale of criterion.scales) {
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
};

// ─── Types and grading functions ─────────────────────────────────────────────

export type ScaleMap = Map<
  string,
  {
    scale: Scale;
    criterion: Criterion;
  }
>;

export const buildScaleMap = (
  criteria: Criterion[]
): ScaleMap => {
  const map: ScaleMap = new Map();

  for (const criterion of criteria) {
    for (const scale of criterion.scales || []) {
      if (scale.id) {
        map.set(scale.id, {
          scale,
          criterion
        });
      }
    }
  }

  return map;
};

export const calculateTotalScore = (
  criteria: Criterion[],
  selections: Record<string, CriterionSelection>,
  scaleMap: ScaleMap
): number => {
  let total = 0;

  for (const criterion of criteria) {
    const selection =
      selections[criterion.id || ''];

    if (!selection?.scale_id) {
      continue;
    }

    const entry =
      scaleMap.get(selection.scale_id);

    if (entry) {
      total +=
        (entry.scale.value ?? 0) *
        ((criterion.weight ?? 0) / 100);
    }
  }

  return Math.round(total * 100) / 100;
};

export const areAllCriteriaSelected = (
  criteria: Criterion[],
  selections: Record<string, CriterionSelection>
): boolean =>
  criteria.every(
    (criterion) =>
      criterion.id &&
      selections[criterion.id]?.scale_id
  );

export const countProgress = (
  criteria: Criterion[],
  selections: Record<string, CriterionSelection>
): number =>
  criteria.filter(
    (criterion) =>
      criterion.id &&
      selections[criterion.id]?.scale_id
  ).length;

export const buildGradePayload = (
  enrollmentId: string,
  rubricId: string,
  criteria: Criterion[],
  selections: Record<string, CriterionSelection>,
  status: 'DRAFT' | 'SENT'
): GradePayload => ({
  enrollment_id: enrollmentId,
  rubric_id: rubricId,
  status,
  details: criteria
    .filter(
      (criterion) =>
        criterion.id &&
        selections[criterion.id]?.scale_id
    )
    .map((criterion) => ({
      scale_id:
        selections[criterion.id!].scale_id,
      comment:
        selections[criterion.id!].comment ||
        undefined,
    })),
});

export const executeSaveGrade = async (
  payload: GradePayload
) => saveGrade(payload);

// ─── Business class ──────────────────────────────────────────────────────────

class RubricBusiness {
  filterTeacherRubrics(
    rubrics: Rubric[],
    evaluations: Evaluation[],
    teacherGroups: Group[]
  ): Rubric[] {
    const groupIds = new Set(
      teacherGroups
        .map((group) => group.id)
        .filter(Boolean)
    );

    const teacherRubricIds = new Set(
      evaluations
        .filter(
          (evaluation) =>
            evaluation.group_id &&
            groupIds.has(evaluation.group_id) &&
            evaluation.rubric_id
        )
        .map(
          (evaluation) =>
            evaluation.rubric_id!
        )
    );

    if (teacherRubricIds.size === 0) {
      return [];
    }

    return rubrics.filter(
      (rubric) =>
        rubric.id &&
        teacherRubricIds.has(rubric.id)
    );
  }

  filterTeacherEvaluations(
    evaluations: Evaluation[],
    teacherGroups: Group[]
  ): Evaluation[] {
    const groupIds = new Set(
      teacherGroups
        .map((group) => group.id)
        .filter(Boolean)
    );

    return evaluations.filter(
      (evaluation) =>
        evaluation.group_id &&
        groupIds.has(evaluation.group_id)
    );
  }
}

export const rubricBusiness =
  new RubricBusiness();