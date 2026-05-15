import { useEffect, useState } from 'react';
import { Carrera } from '../models/Career';
import { carreraService } from '../services/careerService';

const useCarreras = () => {
    const [carreras, setCarreras] = useState<Carrera[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refresh = async () => {
        setLoading(true);
        try {
            const result = await carreraService.getCarreras();
            setCarreras(result);
            setError(null);
        } catch (err) {
            setError('No se pudieron cargar las carreras');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    return { carreras, loading, error, refresh };
};

export default useCarreras;
