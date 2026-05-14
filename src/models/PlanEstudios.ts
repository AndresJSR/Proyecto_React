import { Asignatura } from './Asignatura';

export class PlanEstudios {
    constructor(
        public id: number | null = null,
        public nombre: string = '',
        public descripcion: string = '',
        public carreraId: number | null = null,
        public totalSemestres: number = 0,
        public asignaturas: Asignatura[] = []
    ) {}
}
