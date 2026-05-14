export class Grupo {
    constructor(
        public id: number | null = null,
        public nombre: string = '',
        public asignaturaId: number | null = null,
        public semestreId: number | null = null,
        public profesor: string = '',
        public horario: string = '',
        public capacidad: number = 0
    ) {}
}
