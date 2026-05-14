import axios from 'axios';
import { Carrera } from '../models/Carrera';

const API_URL = import.meta.env.VITE_API_URL + '/carreras' || '/api/carreras';

class CarreraService {
    async getCarreras(): Promise<Carrera[]> {
        try {
            const response = await axios.get<Carrera[]>(API_URL);
            return response.data;
        } catch (error) {
            console.error('Error al obtener carreras:', error);
            return [];
        }
    }

    async getCarreraById(id: number): Promise<Carrera | null> {
        try {
            const response = await axios.get<Carrera>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener carrera:', error);
            return null;
        }
    }

    async createCarrera(carrera: Omit<Carrera, 'id'>): Promise<Carrera | null> {
        try {
            const response = await axios.post<Carrera>(API_URL, carrera);
            return response.data;
        } catch (error) {
            console.error('Error al crear carrera:', error);
            return null;
        }
    }

    async updateCarrera(id: number, carrera: Partial<Carrera>): Promise<Carrera | null> {
        try {
            const response = await axios.put<Carrera>(`${API_URL}/${id}`, carrera);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar carrera:', error);
            return null;
        }
    }

    async deleteCarrera(id: number): Promise<boolean> {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return true;
        } catch (error) {
            console.error('Error al eliminar carrera:', error);
            return false;
        }
    }
}

export const carreraService = new CarreraService();
