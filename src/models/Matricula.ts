export class Matricula {
    constructor(
        public id: number | null = null,
        public alumnoNombre: string = '',
        public carreraId: number | null = null,
        public semestreId: number | null = null,
        public fechaMatricula: string = new Date().toISOString().substring(0, 10),
        public estado: 'pendiente' | 'aprobada' | 'rechazada' = 'pendiente'
    ) {}
}
