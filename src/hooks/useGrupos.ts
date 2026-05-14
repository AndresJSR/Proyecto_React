
import { useEffect, useState } from 'react';
import { Grupo } from '../models/Grupo';
import { grupoService } from '../services/grupoService';
const useGrupos = () => {
    const [grupos, setGrupos] = useState<Grupo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refresh = async () => {
        setLoading(true);
        try {
            const result = await grupoService.getGrupos();
            setGrupos(result);
            setError(null);
        } catch (err) {
            setError('No se pudieron cargar los grupos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    return { grupos, loading, error, refresh };
};

export default useGrupos;
