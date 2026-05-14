import axios from 'axios';
import { Asignatura } from '../models/Asignatura';

const API_URL = `${import.meta.env.VITE_API_URL || '/api'}/asignaturas`;

class AsignaturaService {
    async getAsignaturas(): Promise<Asignatura[]> {
        try {
            const response = await axios.get<Asignatura[]>(API_URL);
            return response.data;
        } catch (error) {
            console.error('Error al obtener asignaturas:', error);
            return [];
        }
    }

    async getAsignaturaById(id: number): Promise<Asignatura | null> {
        try {
            const response = await axios.get<Asignatura>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener asignatura:', error);
            return null;
        }
    }

    async createAsignatura(asignatura: Omit<Asignatura, 'id'>): Promise<Asignatura | null> {
        try {
            const response = await axios.post<Asignatura>(API_URL, asignatura);
            return response.data;
        } catch (error) {
            console.error('Error al crear asignatura:', error);
            return null;
        }
    }

    async updateAsignatura(id: number, asignatura: Partial<Asignatura>): Promise<Asignatura | null> {
        try {
            const response = await axios.put<Asignatura>(`${API_URL}/${id}`, asignatura);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar asignatura:', error);
            return null;
        }
    }

    async deleteAsignatura(id: number): Promise<boolean> {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return true;
        } catch (error) {
            console.error('Error al eliminar asignatura:', error);
            return false;
        }
    }
}

export const asignaturaService = new AsignaturaService();
