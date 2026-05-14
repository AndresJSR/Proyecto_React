export class Asignatura {
    constructor(
        public id: number | null = null,
        public nombre: string = '',
        public codigo: string = '',
        public creditos: number = 0,
        public semestreId: number | null = null,
        public carreraId: number | null = null,
        public optativa: boolean = false
    ) {}
}
