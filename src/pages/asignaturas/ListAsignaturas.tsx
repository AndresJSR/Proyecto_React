import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import TablaAcademica from '../../components/TablaAcademica';
import useAsignaturas from '../../hooks/useAsignaturas';
import { Asignatura } from '../../models/Asignatura';
import { asignaturaService } from '../../services/asignaturaService';

const ListAsignaturas: React.FC = () => {
    const navigate = useNavigate();
    const { asignaturas, loading, error, refresh } = useAsignaturas();

    const handleAction = async (action: string, item: Asignatura) => {
        if (action === 'edit') {
            navigate(`/asignaturas/edit/${item.id}`);
        }
        if (action === 'delete' && item.id) {
            const result = await Swal.fire({
                title: '¿Eliminar asignatura?',
                text: `Asignatura: ${item.nombre}`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
            });
            if (result.isConfirmed) {
                const success = await asignaturaService.deleteAsignatura(item.id);
                if (success) {
                    await Swal.fire('Eliminada', 'La asignatura fue eliminada.', 'success');
                    refresh();
                }
            }
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Asignaturas</h2>
                <button
                    onClick={() => navigate('/asignaturas/create')}
                    className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
                >
                    Crear Asignatura
                </button>
            </div>
            {loading && <p>Cargando asignaturas...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <TablaAcademica
                datos={asignaturas}
                columnas={['id', 'nombre', 'codigo', 'creditos', 'semestreId', 'carreraId', 'optativa']}
                acciones={[{ name: 'edit', label: 'Editar' }, { name: 'delete', label: 'Eliminar' }]}
                onAction={handleAction}
            />
        </div>
    );
};

export default ListAsignaturas;
