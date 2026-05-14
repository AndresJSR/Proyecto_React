import { useEffect, useState } from 'react';
import { Semestre } from '../models/Semestre';
import { semestreService } from '../services/semestreService';

const useSemestres = () => {
    const [semestres, setSemestres] = useState<Semestre[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refresh = async () => {
        setLoading(true);
        try {
            const result = await semestreService.getSemestres();
            setSemestres(result);
            setError(null);
        } catch (err) {
            setError('No se pudieron cargar los semestres');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    return { semestres, loading, error, refresh };
};

export default useSemestres;
