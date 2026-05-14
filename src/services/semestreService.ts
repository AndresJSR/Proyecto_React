import axios from 'axios';
import { Semestre } from '../models/Semestre';

const API_URL = import.meta.env.VITE_API_URL + '/semestres' || '/api/semestres';

class SemestreService {
    async getSemestres(): Promise<Semestre[]> {
        try {
            const response = await axios.get<Semestre[]>(API_URL);
            return response.data;
        } catch (error) {
            console.error('Error al obtener semestres:', error);
            return [];
        }
    }

    async getSemestreById(id: number): Promise<Semestre | null> {
        try {
            const response = await axios.get<Semestre>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener semestre:', error);
            return null;
        }
    }

    async createSemestre(semestre: Omit<Semestre, 'id'>): Promise<Semestre | null> {
        try {
            const response = await axios.post<Semestre>(API_URL, semestre);
            return response.data;
        } catch (error) {
            console.error('Error al crear semestre:', error);
            return null;
        }
    }

    async updateSemestre(id: number, semestre: Partial<Semestre>): Promise<Semestre | null> {
        try {
            const response = await axios.put<Semestre>(`${API_URL}/${id}`, semestre);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar semestre:', error);
            return null;
        }
    }

    async deleteSemestre(id: number): Promise<boolean> {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return true;
        } catch (error) {
            console.error('Error al eliminar semestre:', error);
            return false;
        }
    }
}

export const semestreService = new SemestreService();
