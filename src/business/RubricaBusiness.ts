import { Rubric } from '../models/Rubric';
import { Group } from '../models/Group';
import { Evaluation } from '../models/Evaluation';

class RubricaBusiness {
  /**
   * Filtra las rúbricas publicadas que pertenecen a evaluaciones
   * de los grupos asignados al profesor autenticado.
   */
  filtrarRubricasDelProfesor(
    rubrics: Rubric[],
    evaluations: Evaluation[],
    gruposDelProfesor: Group[]
  ): Rubric[] {
    const groupIds = new Set(gruposDelProfesor.map((g) => g.id).filter(Boolean));

    // Obtener los rubric_id usados en evaluaciones de los grupos del profesor
    const rubricIdsDelProfesor = new Set(
      evaluations
        .filter((ev) => ev.group_id && groupIds.has(ev.group_id) && ev.rubric_id)
        .map((ev) => ev.rubric_id!)
    );

    // Si el profesor no tiene evaluaciones con rúbrica aún,
    // mostramos solo las rúbricas publicadas (is_public) ya que
    // cualquier rúbrica pública puede ser suya o reutilizable.
    // La distinción real requiere teacher_id en Rubric (backend).
    // Por ahora filtramos las que están vinculadas a sus grupos.
    if (rubricIdsDelProfesor.size === 0) {
      return [];
    }

    return rubrics.filter((r) => r.id && rubricIdsDelProfesor.has(r.id));
  }

  /**
   * Filtra las evaluaciones que pertenecen a los grupos del profesor.
   */
  filtrarEvaluacionesDelProfesor(
    evaluations: Evaluation[],
    gruposDelProfesor: Group[]
  ): Evaluation[] {
    const groupIds = new Set(gruposDelProfesor.map((g) => g.id).filter(Boolean));
    return evaluations.filter((ev) => ev.group_id && groupIds.has(ev.group_id));
  }
}

export const rubricaBusiness = new RubricaBusiness();