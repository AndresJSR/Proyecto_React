import { useEffect, useState } from 'react';
import { Inscripcion } from '../models/Inscripcion';
import { inscripcionService } from '../services/inscripcionService';

const useInscripciones = () => {
    const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refresh = async () => {
        setLoading(true);
        try {
            const result = await inscripcionService.getInscripciones();
            setInscripciones(result);
            setError(null);
        } catch (err) {
            setError('No se pudieron cargar las inscripciones');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    return { inscripciones, loading, error, refresh };
};

export default useInscripciones;
