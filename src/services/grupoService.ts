import axios from 'axios';
import { Grupo } from '../models/Grupo';

const API_URL = import.meta.env.VITE_API_URL + '/grupos' || '/api/grupos';

class GrupoService {
    async getGrupos(): Promise<Grupo[]> {
        try {
            const response = await axios.get<Grupo[]>(API_URL);
            return response.data;
        } catch (error) {
            console.error('Error al obtener grupos:', error);
            return [];
        }
    }

    async getGrupoById(id: number): Promise<Grupo | null> {
        try {
            const response = await axios.get<Grupo>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener grupo:', error);
            return null;
        }
    }

    async createGrupo(grupo: Omit<Grupo, 'id'>): Promise<Grupo | null> {
        try {
            const response = await axios.post<Grupo>(API_URL, grupo);
            return response.data;
        } catch (error) {
            console.error('Error al crear grupo:', error);
            return null;
        }
    }

    async updateGrupo(id: number, grupo: Partial<Grupo>): Promise<Grupo | null> {
        try {
            const response = await axios.put<Grupo>(`${API_URL}/${id}`, grupo);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar grupo:', error);
            return null;
        }
    }

    async deleteGrupo(id: number): Promise<boolean> {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return true;
        } catch (error) {
            console.error('Error al eliminar grupo:', error);
            return false;
        }
    }
}

export const grupoService = new GrupoService();
