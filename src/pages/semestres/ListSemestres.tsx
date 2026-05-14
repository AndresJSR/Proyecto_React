import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import TablaAcademica from '../../components/TablaAcademica';
import useSemestres from '../../hooks/useSemestres';
import { Semestre } from '../../models/Semestre';
import { semestreService } from '../../services/semestreService';

const ListSemestres: React.FC = () => {
    const navigate = useNavigate();
    const { semestres, loading, error, refresh } = useSemestres();

    const handleAction = async (action: string, item: Semestre) => {
        if (action === 'edit') {
            navigate(`/semestres/edit/${item.id}`);
        }
        if (action === 'delete' && item.id) {
            const result = await Swal.fire({
                title: '¿Eliminar semestre?',
                text: `Semestre: ${item.nombre}`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
            });
            if (result.isConfirmed) {
                const success = await semestreService.deleteSemestre(item.id);
                if (success) {
                    await Swal.fire('Eliminado', 'El semestre fue eliminado.', 'success');
                    refresh();
                }
            }
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Semestres</h2>
                <button
                    onClick={() => navigate('/semestres/create')}
                    className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
                >
                    Crear Semestre
                </button>
            </div>
            {loading && <p>Cargando semestres...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <TablaAcademica
                datos={semestres}
                columnas={['id', 'numero', 'nombre', 'ano', 'carreraId']}
                acciones={[{ name: 'edit', label: 'Editar' }, { name: 'delete', label: 'Eliminar' }]}
                onAction={handleAction}
            />
        </div>
    );
};

export default ListSemestres;
