export class Semestre {
    constructor(
        public id: number | null = null,
        public numero: number = 1,
        public nombre: string = '',
        public ano: number = new Date().getFullYear(),
        public carreraId: number | null = null
    ) {}
}
