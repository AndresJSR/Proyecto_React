import axios from 'axios';
import { PlanEstudios } from '../models/PlanEstudios';

const API_URL = import.meta.env.VITE_API_URL + '/planes-estudio' || '/api/planes-estudio';

class PlanEstudiosService {
    async getPlanes(): Promise<PlanEstudios[]> {
        try {
            const response = await axios.get<PlanEstudios[]>(API_URL);
            return response.data;
        } catch (error) {
            console.error('Error al obtener planes de estudio:', error);
            return [];
        }
    }

    async getPlanById(id: number): Promise<PlanEstudios | null> {
        try {
            const response = await axios.get<PlanEstudios>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener plan de estudio:', error);
            return null;
        }
    }

    async createPlan(plan: Omit<PlanEstudios, 'id'>): Promise<PlanEstudios | null> {
        try {
            const response = await axios.post<PlanEstudios>(API_URL, plan);
            return response.data;
        } catch (error) {
            console.error('Error al crear plan de estudio:', error);
            return null;
        }
    }

    async updatePlan(id: number, plan: Partial<PlanEstudios>): Promise<PlanEstudios | null> {
        try {
            const response = await axios.put<PlanEstudios>(`${API_URL}/${id}`, plan);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar plan de estudio:', error);
            return null;
        }
    }

    async deletePlan(id: number): Promise<boolean> {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return true;
        } catch (error) {
            console.error('Error al eliminar plan de estudio:', error);
            return false;
        }
    }
}

export const planEstudiosService = new PlanEstudiosService();
