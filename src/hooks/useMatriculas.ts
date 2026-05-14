import { useEffect, useState } from 'react';
import { Matricula } from '../models/Matricula';
import { matriculaService } from '../services/matriculaService';

const useMatriculas = () => {
    const [matriculas, setMatriculas] = useState<Matricula[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refresh = async () => {
        setLoading(true);
        try {
            const result = await matriculaService.getMatriculas();
            setMatriculas(result);
            setError(null);
        } catch (err) {
            setError('No se pudieron cargar las matrículas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    return { matriculas, loading, error, refresh };
};

export default useMatriculas;
