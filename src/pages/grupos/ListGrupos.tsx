import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import TablaAcademica from '../../components/TablaAcademica';
import useGrupos from '../../hooks/useGrupos';
import { Grupo } from '../../models/Grupo';
import { grupoService } from '../../services/grupoService';

const ListGrupos: React.FC = () => {
    const navigate = useNavigate();
    const { grupos, loading, error, refresh } = useGrupos();

    const handleAction = async (action: string, item: Grupo) => {
        if (action === 'edit') {
            navigate(`/grupos/edit/${item.id}`);
        }
        if (action === 'delete' && item.id) {
            const result = await Swal.fire({
                title: '¿Eliminar grupo?',
                text: `Grupo: ${item.nombre}`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
            });
            if (result.isConfirmed) {
                const success = await grupoService.deleteGrupo(item.id);
                if (success) {
                    await Swal.fire('Eliminado', 'El grupo fue eliminado.', 'success');
                    refresh();
                }
            }
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Grupos</h2>
                <button
                    onClick={() => navigate('/grupos/create')}
                    className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
                >
                    Crear Grupo
                </button>
            </div>
            {loading && <p>Cargando grupos...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <TablaAcademica
                datos={grupos}
                columnas={['id', 'nombre', 'asignaturaId', 'semestreId', 'profesor', 'horario', 'capacidad']}
                acciones={[{ name: 'edit', label: 'Editar' }, { name: 'delete', label: 'Eliminar' }]}
                onAction={handleAction}
            />
        </div>
    );
};

export default ListGrupos;
