import axios from 'axios';
import { Matricula } from '../models/Matricula';

const API_URL = import.meta.env.VITE_API_URL + '/matriculas' || '/api/matriculas';

class MatriculaService {
    async getMatriculas(): Promise<Matricula[]> {
        try {
            const response = await axios.get<Matricula[]>(API_URL);
            return response.data;
        } catch (error) {
            console.error('Error al obtener matrículas:', error);
            return [];
        }
    }

    async getMatriculaById(id: number): Promise<Matricula | null> {
        try {
            const response = await axios.get<Matricula>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener matrícula:', error);
            return null;
        }
    }

    async createMatricula(matricula: Omit<Matricula, 'id'>): Promise<Matricula | null> {
        try {
            const response = await axios.post<Matricula>(API_URL, matricula);
            return response.data;
        } catch (error) {
            console.error('Error al crear matrícula:', error);
            return null;
        }
    }

    async updateMatricula(id: number, matricula: Partial<Matricula>): Promise<Matricula | null> {
        try {
            const response = await axios.put<Matricula>(`${API_URL}/${id}`, matricula);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar matrícula:', error);
            return null;
        }
    }

    async deleteMatricula(id: number): Promise<boolean> {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return true;
        } catch (error) {
            console.error('Error al eliminar matrícula:', error);
            return false;
        }
    }
}

export const matriculaService = new MatriculaService();
