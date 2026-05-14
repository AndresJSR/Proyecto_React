import { useEffect, useState } from 'react';
import { PlanEstudios } from '../models/PlanEstudios';
import { planEstudiosService } from '../services/planEstudiosService';

const usePlanEstudios = () => {
    const [planes, setPlanes] = useState<PlanEstudios[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refresh = async () => {
        setLoading(true);
        try {
            const result = await planEstudiosService.getPlanes();
            setPlanes(result);
            setError(null);
        } catch (err) {
            setError('No se pudieron cargar los planes de estudio');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    return { planes, loading, error, refresh };
};

export default usePlanEstudios;
