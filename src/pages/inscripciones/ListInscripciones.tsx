import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import TablaAcademica from '../../components/TablaAcademica';
import useInscripciones from '../../hooks/useInscripciones';
import { Inscripcion } from '../../models/Inscripcion';
import { inscripcionService } from '../../services/inscripcionService';

const ListInscripciones: React.FC = () => {
    const navigate = useNavigate();
    const { inscripciones, loading, error, refresh } = useInscripciones();

    const handleAction = async (action: string, item: Inscripcion) => {
        if (action === 'edit') {
            navigate(`/inscripciones/edit/${item.id}`);
        }
        if (action === 'delete' && item.id) {
            const result = await Swal.fire({
                title: '¿Eliminar inscripción?',
                text: `Alumno: ${item.alumnoNombre}`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
            });
            if (result.isConfirmed) {
                const success = await inscripcionService.deleteInscripcion(item.id);
                if (success) {
                    await Swal.fire('Eliminada', 'La inscripción fue eliminada.', 'success');
                    refresh();
                }
            }
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Inscripciones</h2>
                <button
                    onClick={() => navigate('/inscripciones/create')}
                    className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
                >
                    Crear Inscripción
                </button>
            </div>
            {loading && <p>Cargando inscripciones...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <TablaAcademica
                datos={inscripciones}
                columnas={['id', 'alumnoNombre', 'asignaturaId', 'grupoId', 'fechaInscripcion', 'estado']}
                acciones={[{ name: 'edit', label: 'Editar' }, { name: 'delete', label: 'Eliminar' }]}
                onAction={handleAction}
            />
        </div>
    );
};

export default ListInscripciones;
