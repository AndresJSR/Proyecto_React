export class Carrera {
    constructor(
        public id: number | null = null,
        public nombre: string = '',
        public codigo: string = '',
        public descripcion: string = '',
        public creditosTotales: number = 0
    ) {}
}
